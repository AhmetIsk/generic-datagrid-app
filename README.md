# Electric Vehicle Data Grid Frontend

A React application that showcases how to implement and utilize AG Grid for displaying and managing electric vehicle data. This application demonstrates server-side pagination, filtering, sorting, and CRUD operations.

## Features

- **AG Grid Integration**: Leverages the powerful AG Grid Community Edition for an interactive data grid experience
- **Server-Side Pagination**: Efficiently handles large datasets by loading only the data that needs to be displayed
- **Filtering & Sorting**: Advanced filtering and sorting capabilities with backend integration
- **CRUD Operations**: View detailed information and delete records
- **Material UI**: Modern and responsive user interface built with Material UI components
- **Responsive Design**: Adapts to different screen sizes and devices

## Tech Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **AG Grid Community Edition**: Advanced data grid component
- **Material UI**: React component library implementing Google's Material Design
- **Axios**: Promise-based HTTP client
- **React Router**: Navigation and routing

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd generic-datagrid-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Application

Start the development server:
```bash
npm start
```
or
```bash
yarn start
```

The application will be available at `http://localhost:3000`.

## Application Structure

- **src/components/**: Reusable UI components
  - **OverviewTable.tsx**: Main AG Grid wrapper component
- **src/pages/**: Application pages
  - **DataGridPage.tsx**: Main grid view with filtering
  - **DetailPage.tsx**: Detail view for individual records
- **src/App.tsx**: Main application component and routing

## Usage

### Data Grid Page

The main page displays electric vehicle data in a grid format. Users can:
- Search across all text fields
- Filter by specific columns and operators
- Sort by clicking on column headers
- View detailed information by clicking the view icon
- Delete records by clicking the delete icon

### Detail Page

The detail page displays all information about a selected electric vehicle.

## Configuration

The grid is configured for server-side pagination with the following default settings:
- Page size: 10 rows (configurable by the user)
- Columns: Brand, Model, Body Style, Price, Date
- Actions: View and Delete

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [AG Grid Community Edition](https://www.ag-grid.com/)
- [Material UI](https://mui.com/)
- [React](https://reactjs.org/)
