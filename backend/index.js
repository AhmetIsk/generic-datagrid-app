const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
// Use more specific CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend origin
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'], // Allow all methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection with proper error handling
mongoose.connect('mongodb://localhost:27017/datagrid-db');

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected!');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Define schema and model for electric car data
const dataSchema = new mongoose.Schema({
  Brand: String,
  Model: String,
  AccelSec: Number,
  TopSpeed_KmH: Number,
  Range_Km: Number,
  Efficiency_WhKm: Number,
  FastCharge_KmH: Number,
  RapidCharge: String,
  PowerTrain: String,
  PlugType: String,
  BodyStyle: String,
  Segment: String,
  Seats: Number,
  PriceEuro: Number,
  Date: String
}, {
  timestamps: true
});

// Add text index for search functionality
dataSchema.index({
  Brand: 'text',
  Model: 'text',
  PowerTrain: 'text',
  PlugType: 'text',
  BodyStyle: 'text',
  Segment: 'text'
});

// Create the model with explicit collection name
const DataModel = mongoose.model('Data', dataSchema, 'datas');

// ---- API routes here ----

// Start server
app.listen(5001, () => {
  console.log('🚀 Backend API running on http://localhost:5001');
});

// Get All Data
app.get('/api/data', async (req, res) => {
    const { search, filter, operator, value } = req.query;

    let query = {};

    if (search) {
        query.$text = { $search: search };
    }

    if (filter && operator) {
        switch (operator) {
            case 'contains':
                query[filter] = { $regex: value, $options: 'i' };
                break;
            case 'equals':
                query[filter] = value;
                break;
            case 'starts':
                query[filter] = { $regex: '^' + value, $options: 'i' };
                break;
            case 'ends':
                query[filter] = { $regex: value + '$', $options: 'i' };
                break;
            case 'empty':
                query[filter] = { $in: [null, '', undefined] };
                break;
            default:
                break;
        }
    }

    const data = await DataModel.find(query).limit(100);
    res.json(data);
});

// Get Overview Data (only specified fields) with pagination
app.get('/api/data/overview', async (req, res) => {
    const { search, filter, operator, value, page = 1, pageSize = 10, sortField, sortOrder } = req.query;

    let query = {};
    let projection = {};

    // Always include _id field
    projection = {
        _id: 1,
        Brand: 1,
        Model: 1,
        BodyStyle: 1,
        PriceEuro: 1,
        Date: 1
    };

    // Apply search
    if (search) {
        query.$text = { $search: search };
    }

    // Apply filter
    if (filter && operator) {
        switch (operator) {
            case 'contains':
                query[filter] = { $regex: value, $options: 'i' };
                break;
            case 'equals':
                query[filter] = value;
                break;
            case 'starts':
                query[filter] = { $regex: '^' + value, $options: 'i' };
                break;
            case 'ends':
                query[filter] = { $regex: value + '$', $options: 'i' };
                break;
            case 'empty':
                query[filter] = { $in: [null, '', undefined] };
                break;
            default:
                break;
        }
    }

    try {
        console.log('Overview query:', query);
        console.log('Pagination:', { page, pageSize });

        // Calculate total count for pagination
        const totalCount = await DataModel.countDocuments(query);

        // Calculate skip amount - ensure values are properly parsed as integers
        const parsedPage = parseInt(page) || 1;
        const parsedPageSize = parseInt(pageSize) || 10;
        const skip = (parsedPage - 1) * parsedPageSize;

        // Create query builder
        let queryBuilder = DataModel.find(query, projection)
            .skip(skip)
            .limit(parsedPageSize)
            .lean();

        // Apply sorting if provided
        if (sortField && sortOrder) {
            const sortDirection = sortOrder === 'asc' ? 1 : -1;
            const sortOptions = {};
            sortOptions[sortField] = sortDirection;
            queryBuilder = queryBuilder.sort(sortOptions);
        }

        // Execute query
        const data = await queryBuilder;

        console.log(`Returning ${data.length} overview items (page ${parsedPage} of ${Math.ceil(totalCount / parsedPageSize)})`);

        // Format the response to match AG Grid's expected format for infinite row model
        // AG Grid expects: { success: true, rows: data, lastRow: totalCount }
        res.json({
            success: true,
            rows: data,
            lastRow: totalCount,
            // Include pagination metadata for reference
            pagination: {
                totalCount,
                page: parsedPage,
                pageSize: parsedPageSize,
                totalPages: Math.ceil(totalCount / parsedPageSize)
            }
        });
    } catch (error) {
        console.error('Error in overview endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch overview data'
        });
    }
});

// Get Single Record by ID
app.get('/api/data/:id', async (req, res) => {
  try {
    const item = await DataModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete by ID
app.delete('/api/data/:id', async (req, res) => {
  try {
    const result = await DataModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Simple seed route to import CSV as JSON (Optional for testing)
app.post('/api/seed', async (req, res) => {
  await DataModel.insertMany(req.body);
  res.json({ status: 'Seeded' });
});
