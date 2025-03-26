# Electric Vehicle Data Grid Backend

A Node.js backend server that powers the Electric Vehicle Data Grid application. This server provides REST API endpoints for pagination, filtering, sorting, and CRUD operations on electric vehicle data stored in MongoDB.

## Features

- **RESTful API**: Well-designed API endpoints for client interactions
- **MongoDB Integration**: Efficient data storage and retrieval
- **Server-Side Pagination**: Optimized data loading with skip and limit
- **Advanced Filtering**: Support for multiple filtering operators
- **Text Search**: Full-text search across multiple fields
- **Sorting**: Dynamic sorting capabilities
- **Error Handling**: Comprehensive error handling and reporting

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **CORS**: Cross-Origin Resource Sharing support

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB (local or remote instance)
- npm or yarn

### Installation

1. Navigate to the backend directory:
   ```bash
   cd generic-datagrid-app/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Configuration

By default, the server connects to a local MongoDB instance. You can modify the connection string in `index.js` if you need to connect to a remote database.

### Running the Server

Start the server:
```bash
node index.js
```

The server will run on `http://localhost:5001`.

## API Documentation

### Get Overview Data (with pagination)

```
GET /api/data/overview
```

Query parameters:
- `page`: Page number (default: 1)
- `pageSize`: Number of items per page (default: 10)
- `search`: Text search across indexed fields
- `filter`: Field to filter on
- `operator`: Operator for filtering (contains, equals, starts, ends, empty)
- `value`: Value for filtering
- `sortField`: Field to sort by
- `sortOrder`: Sort direction (asc, desc)

Response format:
```json
{
  "success": true,
  "rows": [...],
  "lastRow": 100,
  "pagination": {
    "totalCount": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### Get All Data

```
GET /api/data
```

Returns all data (limited to 100 records) with optional filtering.

### Get Single Record

```
GET /api/data/:id
```

Returns a single record by ID.

### Delete Record

```
DELETE /api/data/:id
```

Deletes a record by ID.

### Seed Data

```
POST /api/seed
```

Optional endpoint for importing data. Accepts an array of records in the request body.

## Data Schema

The electric vehicle data has the following schema:

```javascript
{
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
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200 OK`: Successful operation
- `204 No Content`: Successful deletion
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a meaningful message and, when applicable, error details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)