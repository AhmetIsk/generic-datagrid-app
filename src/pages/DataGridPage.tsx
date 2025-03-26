import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams, IDatasource, IGetRowsParams } from "ag-grid-community";
import { TextField, Button, MenuItem, Box, Typography, Paper, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { OverviewTable } from '../components/OverviewTable';

const filterOperators = [
  { label: "Contains", value: "contains" },
  { label: "Equals", value: "equals" },
  { label: "Starts with", value: "starts" },
  { label: "Ends with", value: "ends" },
  { label: "Is empty", value: "empty" },
];

// Set the overview fields we want to display in the grid
const OVERVIEW_FIELDS = ['Brand', 'Model', 'BodyStyle', 'PriceEuro', 'Date'];

// Generic interface for all types of data
interface IDataRow {
  [key: string]: any;
  _id?: string;
}

// Pagination metadata interface
interface IPaginationMeta {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Create a custom cell renderer component for actions
function ActionCellRenderer(props: ICellRendererParams) {
  const navigate = useNavigate();

  const handleView = () => {
    if (props.data && props.data._id) {
      navigate(`/detail/${props.data._id}`);
    }
  };

  const handleDelete = async () => {
    if (props.data && props.data._id) {
      try {
        await axios.delete(`http://localhost:5001/api/data/${props.data._id}`);
        // Signal to refresh data
        if (props.context && props.context.refreshData) {
          props.context.refreshData();
        }
      } catch (err) {
        console.error('Error deleting item:', err);
        if (props.context && props.context.setError) {
          props.context.setError('Failed to delete item. Please try again.');
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <IconButton
        size="small"
        color="primary"
        onClick={handleView}
        aria-label="view"
        sx={{ padding: '4px', marginRight: '4px' }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={handleDelete}
        aria-label="delete"
        sx={{ padding: '4px' }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

export const DataGridPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [operator, setOperator] = useState('');
  const [columns, setColumns] = useState<string[]>(OVERVIEW_FIELDS);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortModel, setSortModel] = useState<{ colId: string, sort: string } | null>(null);

  // Grid reference
  const gridRef = useRef<AgGridReact>(null);

  // Context for the grid cell renderers
  const contextValues = {
    refreshData: () => {
      if (gridRef.current && gridRef.current.api) {
        gridRef.current.api.refreshInfiniteCache();
      }
    },
    setError: setError
  };

  // Initialize column definitions
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  // Update column definitions when columns change
  useEffect(() => {
    if (columns.length > 0) {
      // Create data columns
      const dynamicCols: ColDef[] = columns.map(col => {
        let colDef: ColDef = {
          field: col,
          headerName: col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1'),
          sortable: true,
          filter: true,
          resizable: true
        };

        // Add specific formatters for certain fields
        if (col === 'PriceEuro') {
          colDef.valueFormatter = (params: any) =>
            params.value ? `€${params.value.toLocaleString()}` : '';
        }

        if (col === 'Date') {
          colDef.valueFormatter = (params: any) =>
            params.value ? new Date(params.value).toLocaleDateString() : '';
        }

        return colDef;
      });

      // Define the actions column separately
      const actionsCol: ColDef = {
        headerName: 'Actions',
        field: 'actions',
        sortable: false,
        filter: false,
        width: 120,
        cellRenderer: ActionCellRenderer
      };

      // Add the actions column to the end
      setColDefs([...dynamicCols, actionsCol]);
    }
  }, [columns]);

  // Create datasource for infinite row model
  const createDatasource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        try {
          setLoading(true);
          setError(null);

          // Calculate current page based on startRow and endRow
          const pageSize = params.endRow - params.startRow;
          const page = Math.floor(params.startRow / pageSize) + 1;

          // Build query parameters
          const queryParams: any = {
            page,
            pageSize
          };

          // Add search if provided
          if (search) queryParams.search = search;

          // Add filter if provided
          if (filterField && operator) {
            queryParams.filter = filterField;
            queryParams.operator = operator;
            if (operator !== 'empty') {
              queryParams.value = filterValue;
            }
          }

          // Add sorting if provided
          if (params.sortModel && params.sortModel.length > 0) {
            queryParams.sortField = params.sortModel[0].colId;
            queryParams.sortOrder = params.sortModel[0].sort;
            setSortModel(params.sortModel[0]);
          } else if (sortModel) {
            queryParams.sortField = sortModel.colId;
            queryParams.sortOrder = sortModel.sort;
          }

          console.log('Fetching page:', page, 'with size:', pageSize,
            'startRow:', params.startRow, 'endRow:', params.endRow);

          const response = await axios.get('http://localhost:5001/api/data/overview', {
            params: queryParams,
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          // Handle the response based on updated backend format
          if (response.data.success) {
            const { rows, lastRow, pagination } = response.data;
            setTotalItems(pagination.totalCount);

            // Call the AG Grid success callback with rows and lastRow
            params.successCallback(rows, lastRow);
          } else {
            setError('Failed to fetch data');
            params.failCallback();
          }
        } catch (error) {
          console.error('Error fetching data:', error);

          if (axios.isAxiosError(error)) {
            if (error.response) {
              setError(`Error ${error.response.status}: ${error.response.data}`);
            } else {
              setError(`Network error: ${error.message}. Please check if the backend server is running.`);
            }
          } else if (error instanceof Error) {
            setError(`Error: ${error.message}`);
          } else {
            setError('Unknown error occurred');
          }

          // Tell AG Grid there was an error
          params.failCallback();
        } finally {
          setLoading(false);
        }
      }
    };
  }, [search, filterField, operator, filterValue, sortModel]);

  // Apply filters and refresh grid
  const applyFilters = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.refreshInfiniteCache();
    }
  }, []);

  // Default column settings
  const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true
  };

  const memoizedDatasource = useMemo(() => createDatasource(), [createDatasource]);

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

      <Paper elevation={3} sx={{ p: 2, height: '100%', width: '100%' }}>
        <Typography variant="h5" mb={2}>
          {loading ? 'Loading Data...' : `Electric Vehicle Overview (${totalItems} items)`}
        </Typography>
        <OverviewTable
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowData={[]}
          ref={gridRef}
          context={contextValues}
          loading={loading}
          totalItems={totalItems}
          datasource={memoizedDatasource}
        />
      </Paper>
    </Box>
  );
};
