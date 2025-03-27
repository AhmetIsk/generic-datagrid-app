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

// Helper function to apply a filter to a query
function applyFilter(query, filter, operator, value) {
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
  return query;
}

// Get All Data
app.get('/api/data', async (req, res) => {
    const { search, filter, operator, value } = req.query;

    let query = {};

    if (search) {
        query.$text = { $search: search };
    }

    if (filter && operator) {
        query = applyFilter(query, filter, operator, value);
    }

    const data = await DataModel.find(query).limit(100);
    res.json(data);
});

// Get Overview Data (only specified fields) with pagination
app.get('/api/data/overview', async (req, res) => {
    console.log('Received query params:', req.query);

    const {
      search,
      filter, operator, value, // Keep for backward compatibility
      filtersJson, // New parameter for JSON array of filter objects
      page = 1, pageSize = 10,
      sortField, sortOrder
    } = req.query;

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

    // Apply search - Use direct regex approach for better reliability
    if (search && search.trim()) {
        const searchTerm = search.trim();
        console.log('Applying regex search for:', searchTerm);

        // Use $or to search across multiple fields with case-insensitive regex
        query.$or = [
            { Brand: { $regex: searchTerm, $options: 'i' } },
            { Model: { $regex: searchTerm, $options: 'i' } },
            { BodyStyle: { $regex: searchTerm, $options: 'i' } },
            { PowerTrain: { $regex: searchTerm, $options: 'i' } },
            { PlugType: { $regex: searchTerm, $options: 'i' } },
            { Segment: { $regex: searchTerm, $options: 'i' } }
        ];

        // Log what we're searching
        console.log(`Searching fields: Brand, Model, BodyStyle, PowerTrain, PlugType, Segment for "${searchTerm}"`);
    }

    // Handle multiple filters via JSON string
    if (filtersJson) {
        try {
            const filters = JSON.parse(filtersJson);
            console.log('Parsed filters:', filters);

            if (Array.isArray(filters) && filters.length > 0) {
                // For multiple filters with existing search
                if (query.$or && filters.length >= 1) {
                    // If we already have a search query ($or), we need to use $and to combine with filters
                    const searchCondition = { $or: query.$or };
                    query = { $and: [searchCondition] };

                    // Add filter conditions to the $and array
                    if (filters.length > 1) {
                        // For multiple filters, add them as an $and condition
                        const filterConditions = filters.map(f => {
                            const filterQuery = {};
                            return applyFilter(filterQuery, f.filter, f.operator, f.value);
                        });
                        query.$and.push(...filterConditions);
                    } else {
                        // For a single filter, add it directly to $and
                        const filterQuery = {};
                        query.$and.push(applyFilter(filterQuery, filters[0].filter, filters[0].operator, filters[0].value));
                    }
                } else {
                    // No search query, just handle filters
                    if (filters.length > 1) {
                        query.$and = filters.map(f => {
                            const filterQuery = {};
                            return applyFilter(filterQuery, f.filter, f.operator, f.value);
                        });
                    } else {
                        // For a single filter, just apply it directly
                        query = applyFilter(query, filters[0].filter, filters[0].operator, filters[0].value);
                    }
                }
            }
        } catch (error) {
            console.error('Error parsing filters JSON:', error);
            // Fall back to single filter if JSON parsing fails
            if (filter && operator) {
                query = applyFilter(query, filter, operator, value);
            }
        }
    } else if (filter && operator) {
        // Legacy single filter support (combined with search if present)
        if (query.$or) {
            // If we have a search, we need to combine with filter using $and
            const searchCondition = { $or: query.$or };
            const filterCondition = {};
            applyFilter(filterCondition, filter, operator, value);
            query = { $and: [searchCondition, filterCondition] };
        } else {
            // No search, just apply filter directly
            query = applyFilter(query, filter, operator, value);
        }
    }

    try {
        console.log('Overview query:', JSON.stringify(query, null, 2));
        console.log('Pagination:', { page, pageSize });

        // DEBUGGING: Check if there are any Tesla cars in the database
        const teslaCount = await DataModel.countDocuments({ Brand: /tesla/i });
        console.log(`DEBUG: Found ${teslaCount} Tesla cars in the database`);

        // Calculate total count for pagination
        const totalCount = await DataModel.countDocuments(query);
        console.log('Total documents matching query:', totalCount);

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

        // Debug output for the first few results
        if (data.length > 0) {
            console.log('Sample data:', data.slice(0, 2));
        } else {
            console.log('No data found for query');
        }

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

// Get document count (for debugging)
app.get('/api/count', async (req, res) => {
  try {
    const count = await DataModel.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(5001, () => {
  console.log('🚀 Backend API running on http://localhost:5001');
});
