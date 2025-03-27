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

interface Search {
  value: string;
}

/**
 * DataGrid page component
 * Displays a data grid with filtering capabilities
 */
const DataGridPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<Search>({ value: '' });
  const debouncedSearch = useDebounce<Search>(search, 500);
  const [currentFilter, setCurrentFilter] = useState({
    field: '',
    operator: '',
    value: ''
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterItem[]>([]);
  const [gridKey, setGridKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gridApiRef = useRef<GridApi | null>(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemId: '',
    itemName: '',
    isDeleting: false
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    setLoading(true);
    setGridKey(prev => prev + 1);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [debouncedSearch.value]);

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

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true
  }), []);

  const onGridReady = useCallback((api: GridApi) => {
    gridApiRef.current = api;
    api.sizeColumnsToFit();
  }, []);

  const applyFilters = () => {
    setLoading(true);
    setError(null);

    try {
      const newFilters = [...appliedFilters];

      if (currentFilter.field && currentFilter.operator) {
        const newFilter: FilterItem = {
          id: uuidv4(),
          filter: currentFilter.field,
          operator: currentFilter.operator,
          value: currentFilter.value
        };

        newFilters.push(newFilter);

        setCurrentFilter({
          field: '',
          operator: '',
          value: ''
        });
      }

      setAppliedFilters(newFilters);
      setGridKey(prev => prev + 1);

      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Error applying filters. Please try again.');
      setLoading(false);
    }
  };

  const removeFilter = (id: string) => {
    setAppliedFilters(prev => prev.filter(filter => filter.id !== id));
    setGridKey(prev => prev + 1);
  };

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

  const openDeleteConfirm = (itemId: string, itemName: string) => {
    setDeleteDialog({
      open: true,
      itemId,
      itemName,
      isDeleting: false
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      ...deleteDialog,
      open: false
    });
  };

  const handleDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, isDeleting: true }));

    try {
      await apiService.deleteRecord(deleteDialog.itemId);

      setDeleteDialog({
        open: false,
        itemId: '',
        itemName: '',
        isDeleting: false
      });

      showNotification(`${deleteDialog.itemName} was successfully deleted`, 'success');

      setGridKey(prev => prev + 1);
    } catch (err) {
      showNotification('Failed to delete the item. Please try again.', 'error');
      setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const contextValues = {
    setError,
    refreshGrid: () => setGridKey(prev => prev + 1),
    openDeleteConfirm
  };

  const gridOptions = useMemo<GridOptions>(() => {
    const filterOptions: FilterOptions = {
      search: debouncedSearch.value,
      filters: appliedFilters
    };

    setLoading(true);

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

  const handleRowClicked = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <Box sx={{
      padding: '24px'
    }}>
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
      <DeleteConfirmDialog
        open={deleteDialog.open}
        itemName={deleteDialog.itemName}
        isDeleting={deleteDialog.isDeleting}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
      />
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
