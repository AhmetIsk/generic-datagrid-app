import React, { memo, useState, useCallback } from 'react';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import {
  ColDef,
  PaginationChangedEvent,
  GridReadyEvent,
  GridApi,
  RowModelType
} from 'ag-grid-community';
import { Box, Typography } from '@mui/material';

interface OverviewTableProps extends AgGridReactProps {
  rowData: any[];
  columnDefs: ColDef[];
  defaultColDef: ColDef;
  animateRows: boolean;
  context: any;
  loading: boolean;
  ref: React.RefObject<AgGridReact>;
  totalItems?: number;
  datasource: any;
}

const OverviewTableComponent: React.FC<OverviewTableProps> = ({
  rowData,
  columnDefs,
  defaultColDef,
  animateRows,
  context,
  loading,
  ref,
  datasource,
  totalItems = 0,
}) => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Monitor pagination changes
  const onPaginationChanged = useCallback((event: PaginationChangedEvent) => {
    if (ref && ref.current && ref.current.api) {
      const api = ref.current.api;
      const newPageSize = api.paginationGetPageSize();
      const newPageNum = api.paginationGetCurrentPage();

      console.log('Pagination changed:', {
        pageSize: newPageSize,
        currentPage: newPageNum,
        totalItems: totalItems
      });

      // Update state for reference
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
        // Force refresh when page size changes
        api.refreshInfiniteCache();
      }

      setCurrentPage(newPageNum);
    }
  }, [ref, pageSize, totalItems]);

  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    if (ref && ref.current && ref.current.api) {
      console.log('Grid ready, initializing with pageSize:', pageSize);

      // For infinite row model, directly use the datasource prop
      // No need to set it programmatically
    }
  }, [ref, pageSize]);

  return (
    <Box className="ag-theme-alpine" height="calc(100% - 50px)" width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1">
          {loading ? 'Loading...' : `${totalItems} items total | Page ${currentPage + 1}`}
        </Typography>
      </Box>
      <AgGridReact
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={animateRows}
        ref={ref}
        context={context}
        domLayout='autoHeight'
        rowModelType={'infinite'}
        pagination={true}
        paginationPageSize={pageSize}
        cacheBlockSize={pageSize}
        infiniteInitialRowCount={totalItems > 0 ? Math.min(totalItems, 100) : 10}
        maxBlocksInCache={10}
        paginationPageSizeSelector={[5, 10, 25, 50, 100]}
        onGridReady={onGridReady}
        onPaginationChanged={onPaginationChanged}
        suppressCellFocus={false}
        overlayNoRowsTemplate={loading ? 'Loading data...' : 'No data to display'}
        datasource={datasource}
      />
    </Box>
  );
};

// Export a memoized version of the component to prevent unnecessary re-renders
export const OverviewTable = memo(OverviewTableComponent);


