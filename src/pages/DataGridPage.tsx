import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import { GridApi, ColDef, GridOptions, RowModelType } from 'ag-grid-community';
import { gridDatasourceService, FilterOptions } from '../services/grid-datasource.service';
import { FilterItem } from '../services/api.service';
import { apiService } from '../services/api.service';
import { OverviewTable } from '../components/table/OverviewTable';
import { v4 as uuidv4 } from 'uuid';
import ActionCellRenderer from '../components/ActionCellRenderer';
import NotificationSnackbar from '../components/NotificationSnackbar';
import { FilterPanel } from '../components/filter/FilterPanel';
import DeleteConfirmDialog from '../components/shared/DeleteConfirmDialog';
import { useDebounce } from '../utils/hooks';

// Define search interface
interface Search {
  value: string;
}

/**
 * DataGrid page component
 * Displays a data grid with filtering capabilities
 */
const DataGridPage: React.FC = () => {
  const navigate = useNavigate();

  // State for search input and debounced search
  const [search, setSearch] = useState<Search>({ value: '' });
  const debouncedSearch = useDebounce<Search>(search, 500); // 500ms debounce time

  // State for current filter being built
  const [currentFilter, setCurrentFilter] = useState({
    field: '',
    operator: '',
    value: ''
  });

  // State for applied filters (can have multiple)
  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);

  // Grid key to force re-render when needed
  const [gridKey, setGridKey] = useState(0);

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // State for error message
  const [error, setError] = useState<string | null>(null);

  // Reference to Grid API
  const gridApiRef = useRef<GridApi | null>(null);

  // State for delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemId: '',
    itemName: '',
    isDeleting: false
  });

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Effect to apply debounced search
  useEffect(() => {
    // Only trigger if we have a search value changes (including when cleared)
    setLoading(true);
    // Refresh the grid with the new search term
    setGridKey(prev => prev + 1);
    // Simulate some loading time
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [debouncedSearch.value]);

  // Define column definitions
  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'Brand', headerName: 'Brand', sortable: true, filter: true, flex: 1 },
    { field: 'Model', headerName: 'Model', sortable: true, filter: true, flex: 1 },
    { field: 'BodyStyle', headerName: 'Body Style', sortable: true, filter: true, flex: 1 },
    {
      field: 'PriceEuro',
      headerName: 'Price (€)',
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => params.value ? `€${params.value.toLocaleString()}` : ''
    },
    {
      field: 'Date',
      headerName: 'Date',
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      width: 120,
      cellRenderer: ActionCellRenderer
    }
  ], []);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true
  }), []);

  // Function to handle grid ready event
  const onGridReady = useCallback((api: GridApi) => {
    gridApiRef.current = api;
    api.sizeColumnsToFit();
  }, []);

  // Function to apply filters and refresh the grid
  const applyFilters = () => {
    setLoading(true);
    setError(null);

    try {
      // Create a new array of filters
      const newFilters = [...appliedFilters];

      // If we have a current filter that's valid, add it
      if (currentFilter.field && currentFilter.operator) {
        const newFilter: FilterItem = {
          id: uuidv4(), // Generate unique ID
          filter: currentFilter.field,
          operator: currentFilter.operator,
          value: currentFilter.value
        };

        newFilters.push(newFilter);

        // Reset current filter
        setCurrentFilter({
          field: '',
          operator: '',
          value: ''
        });
      }

      // Update applied filters
      setAppliedFilters(newFilters);

      // Force grid refresh by incrementing key
      setGridKey(prev => prev + 1);

      // Simulate delay to show loading
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Error applying filters. Please try again.');
      setLoading(false);
    }
  };

  // Function to remove a specific filter
  const removeFilter = (id: string) => {
    setAppliedFilters(prev => prev.filter(filter => filter.id !== id));
    setGridKey(prev => prev + 1);
  };

  // Function to clear all filters
  const clearFilters = () => {
    setAppliedFilters([]);
    setSearch({ value: '' });
    setCurrentFilter({
      field: '',
      operator: '',
      value: ''
    });
    setGridKey(prev => prev + 1);
  };

  // Function to open delete confirmation dialog
  const openDeleteConfirm = (itemId: string, itemName: string) => {
    setDeleteDialog({
      open: true,
      itemId,
      itemName,
      isDeleting: false
    });
  };

  // Function to close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      ...deleteDialog,
      open: false
    });
  };

  // Function to handle actual deletion
  const handleDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, isDeleting: true }));

    try {
      await apiService.deleteRecord(deleteDialog.itemId);

      // Close dialog and show success notification
      setDeleteDialog({
        open: false,
        itemId: '',
        itemName: '',
        isDeleting: false
      });

      // Show success notification
      showNotification(`${deleteDialog.itemName} was successfully deleted`, 'success');

      // Refresh the grid
      setGridKey(prev => prev + 1);
    } catch (err) {
      // Show error notification
      showNotification('Failed to delete the item. Please try again.', 'error');
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Function to show notification
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Function to close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Update context values to include delete confirmation function
  const contextValues = {
    setError,
    refreshGrid: () => setGridKey(prev => prev + 1),
    openDeleteConfirm
  };

  // Create grid options with datasource
  const gridOptions = useMemo<GridOptions>(() => {
    // Create filter options from state
    const filterOptions: FilterOptions = {
      search: debouncedSearch.value,
      filters: appliedFilters
    };

    // Set loading state when datasource is being created
    setLoading(true);

    // Create server-side datasource
    const datasource = gridDatasourceService.createServerSideDatasource(filterOptions);

    return {
      rowModelType: 'serverSide' as RowModelType,
      serverSideDatasource: datasource,
      pagination: true,
      paginationPageSize: 20,
      cacheBlockSize: 20,
      onFirstDataRendered: () => {
        setLoading(false);
      }
    };
  }, [debouncedSearch.value, appliedFilters]);

  // Function to handle row click (for navigation to detail view)
  const handleRowClicked = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <Box sx={{
      padding: '24px'
    }}>
      <Typography variant="h5" sx={{
        color: '#262626',
        fontWeight: 500,
        paddingBottom: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid var(--bmw-blue)'
      }}>
        BMW Electric Vehicles Overview
      </Typography>

      {/* Filter panel */}
      <FilterPanel
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        appliedFilters={appliedFilters}
        searchValue={search.value}
        onSearchChange={(value) => setSearch({ value })}
        onApplyFilter={applyFilters}
        onRemoveFilter={removeFilter}
        onClearAllFilters={clearFilters}
        error={error}
      />

      {/* Data Grid */}
      <Card sx={{
        borderRadius: 0,
        border: '1px solid #e6e6e6',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <CardContent>
          <Box sx={{
            width: '100%'
          }}>
            <OverviewTable
              key={gridKey}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              context={contextValues}
              onGridReady={onGridReady}
              onRowClicked={handleRowClicked}
              loading={loading}
              gridOptions={gridOptions}
              hasFilters={appliedFilters.length > 0 || !!debouncedSearch.value}
              onClearFilters={clearFilters}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        itemName={deleteDialog.itemName}
        isDeleting={deleteDialog.isDeleting}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default DataGridPage;
