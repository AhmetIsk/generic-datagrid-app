import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi, GridOptions, ModelUpdatedEvent } from 'ag-grid-community';
import { Typography, Box, Button, CircularProgress, Stack } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

const styles = {
  tableContainer: {
    height: '600px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  tableHeader: {
    padding: '8px 0'
  },
  tableTextBody: {
    marginBottom: '24px'
  },
  loadingText: {
    marginTop: '16px',
    color: '#8e8e8e'
  },
  gridContainer: {
    flex: 1,
    width: '100%',
    minHeight: '500px',
    position: 'relative'
  },
  emptyOverlay: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10
  },
  loadingOverlay: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  overlayContent: {
    padding: '1rem',
    textAlign: 'center',
    maxWidth: '500px'
  },
  noMatchIcon: {
    fontSize: '60px',
    marginBottom: '1rem',
    color: '#1c69d4'
  },
  noDataIcon: {
    fontSize: '60px',
    marginBottom: '1rem',
    color: '#8e8e8e'
  },
  clearFiltersButton: {
    marginTop: '1rem',
    backgroundColor: '#1c69d4',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#0653b6'
    }
  }
};

interface OverviewTableProps {
  columnDefs: ColDef[];
  defaultColDef: ColDef;
  context: any;
  loading: boolean;
  totalItems?: number;
  onRowClicked?: (id: string) => void;
  onGridReady?: (api: GridApi) => void;
  gridOptions?: GridOptions;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

const NoRowsOverlay: React.FC<{ hasFilters?: boolean; onClearFilters?: () => void }> = ({
  hasFilters,
  onClearFilters
}) => (
  <Box sx={styles.emptyOverlay}>
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={styles.overlayContent}
    >
      {hasFilters ? (
        <FilterAltOffIcon sx={styles.noMatchIcon} />
      ) : (
        <SearchOffIcon sx={styles.noDataIcon} />
      )}
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {hasFilters ? 'No matching results found' : 'No data available'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={styles.tableTextBody}>
        {hasFilters
          ? 'Your search or filter criteria did not match any records.'
          : 'There are no records to display in this view.'}
      </Typography>
      {hasFilters && onClearFilters && (
        <Button
          variant="contained"
          color="primary"
          onClick={onClearFilters}
          sx={styles.clearFiltersButton}
        >
          Clear All Filters
        </Button>
      )}
    </Stack>
  </Box>
);

const LoadingOverlay: React.FC = () => (
  <Stack
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={styles.loadingOverlay}
  >
    <CircularProgress size={60} />
    <Typography variant="h6" color="text.secondary" sx={styles.loadingText}>
      Loading data...
    </Typography>
  </Stack>
);

const OverviewTableComponent: React.FC<OverviewTableProps> = ({
  columnDefs,
  defaultColDef,
  context,
  loading,
  totalItems = 0,
  onRowClicked,
  onGridReady: externalGridReady,
  gridOptions,
  hasFilters = false,
  onClearFilters
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowCount, setRowCount] = useState<number>(totalItems);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [showEmptyOverlay, setShowEmptyOverlay] = useState<boolean>(false);

  const handleGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);

    if (externalGridReady) {
      externalGridReady(params.api);
    }
  }, [externalGridReady]);

  const handleModelUpdated = useCallback((event: ModelUpdatedEvent) => {
    if (!event.api) return;

    const currentRowCount = event.api.getDisplayedRowCount();
    setRowCount(currentRowCount);

    setShowEmptyOverlay(currentRowCount === 0 && !loading);
  }, [loading]);

  useEffect(() => {
    if (gridApi) {
      if (loading) {
        setShowEmptyOverlay(false);
      } else if (rowCount === 0) {
        setShowEmptyOverlay(true);
      }
    }
  }, [loading, rowCount, gridApi]);

  const mergedGridOptions: GridOptions = {
    ...gridOptions,
    rowModelType: 'serverSide',
    pagination: true,
    paginationPageSize: 20,
    onModelUpdated: handleModelUpdated,
    serverSideDatasource: gridOptions?.serverSideDatasource,
  };

  return (
    <Stack direction="column" sx={styles.tableContainer}>
      <Box sx={styles.tableHeader}>
        <Typography variant="subtitle1">
          {loading ? 'Loading...' : `${rowCount} items found`}
        </Typography>
      </Box>

      <Box
        className="ag-theme-material"
        sx={styles.gridContainer}
      >
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          context={context}
          onGridReady={handleGridReady}
          {...mergedGridOptions}
        />

        {loading && <LoadingOverlay />}

        {showEmptyOverlay && !loading && (
          <NoRowsOverlay hasFilters={hasFilters} onClearFilters={onClearFilters} />
        )}
      </Box>
    </Stack>
  );
};

export const OverviewTable = memo(OverviewTableComponent);
