import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, MenuItem } from '@mui/material';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { OverviewTable } from '../components/OverviewTable';
import { apiService } from '../services/api.service';
import { createGridDatasource } from '../services/grid-datasource.service';
import ActionCellRenderer from '../components/ActionCellRenderer';

// Define filter operators
const filterOperators = [
  { label: "Contains", value: "contains" },
  { label: "Equals", value: "equals" },
  { label: "Starts with", value: "starts" },
  { label: "Ends with", value: "ends" },
  { label: "Is empty", value: "empty" },
];

// Set the overview fields to display in the grid
const OVERVIEW_FIELDS = ['Brand', 'Model', 'BodyStyle', 'PriceEuro', 'Date'];

// Extend GridApi for refresh method
interface ExtendedGridApi extends GridApi {
  refreshServerSideStore: (params?: { purge?: boolean }) => void;
}

export const DataGridPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [operator, setOperator] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [columns] = useState<string[]>(OVERVIEW_FIELDS);
  const gridApiRef = useRef<ExtendedGridApi | null>(null);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  // Create datasource
  const datasource = useCallback(createGridDatasource, [])();

  // Update column definitions when columns change
  useEffect(() => {
    if (columns.length > 0) {
      const dynamicCols: ColDef[] = columns.map(col => ({
        field: col,
        headerName: col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1'),
        sortable: true,
        filter: true,
        resizable: true,
        valueFormatter:
          col === 'PriceEuro' ? (params: any) => params.value ? `€${params.value.toLocaleString()}` : '' :
            col === 'Date' ? (params: any) => params.value ? new Date(params.value).toLocaleDateString() : '' :
              undefined
      }));

      // Add the actions column
      const actionsCol: ColDef = {
        headerName: 'Actions',
        field: 'actions',
        sortable: false,
        filter: false,
        width: 120,
        cellRenderer: ActionCellRenderer
      };

      setColDefs([...dynamicCols, actionsCol]);
    }
  }, [columns]);

  // Fetch total count on component mount
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        setLoading(true);
        const response = await apiService.getOverviewData({
          page: 1,
          pageSize: 10
        });
        setTotalItems(response.lastRow);
      } catch (err) {
        console.error('Error fetching total count:', err);
        setError('Failed to fetch data count. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalCount();
  }, []);

  // Handle grid API ready
  const onGridReady = useCallback((api: GridApi) => {
    gridApiRef.current = api as ExtendedGridApi;
  }, []);

  // Handle row click to navigate to detail page
  const handleRowClicked = useCallback((id: string) => {
    navigate(`/detail/${id}`);
  }, [navigate]);

  // Apply filters programmatically
  const applyFilters = useCallback(() => {
    if (gridApiRef.current) {
      gridApiRef.current.refreshServerSideStore({ purge: true });
    }
  }, []);

  // Context for the grid
  const contextValues = {
    setError,
    refreshGrid: applyFilters
  };

  const gridOptions: GridOptions = {
    rowModelType: 'serverSide',
    serverSideDatasource: datasource,
    pagination: true,
    paginationPageSize: 20,
    cacheBlockSize: 20,
  };

  // Default column settings
  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true
  };

  return (
    <Box p={3} height="100%">
      {error && (
        <Box mb={2} p={2} bgcolor="#ffebee" color="#c62828" borderRadius={1}>
          <strong>Error:</strong> {error}
        </Box>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" mb={2}>Search & Filter</Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Global Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Filter Column"
            select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 150 }}
          >
            {columns.map((col) => (
              <MenuItem key={col} value={col}>{col}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Operator"
            select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 150 }}
          >
            {filterOperators.map((op) => (
              <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
            ))}
          </TextField>
          {operator !== 'empty' && (
            <TextField
              label="Filter Value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              variant="outlined"
              size="small"
            />
          )}
          <Button variant="contained" onClick={applyFilters}>
            Apply
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 250px)', width: '100%' }}>
        <Typography variant="h5" mb={2}>
          {loading ? 'Loading Data...' : `Electric Vehicle Overview (${totalItems} items)`}
        </Typography>
        <div style={{ height: 'calc(100% - 60px)', width: '100%' }}>
          <OverviewTable
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            context={contextValues}
            loading={loading}
            totalItems={totalItems}
            onRowClicked={handleRowClicked}
            onGridReady={onGridReady}
            gridOptions={gridOptions}
          />
        </div>
      </Paper>
    </Box>
  );
};
