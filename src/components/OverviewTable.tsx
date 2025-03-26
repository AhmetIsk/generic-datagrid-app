import React, { memo, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi, GridOptions } from 'ag-grid-community';
import { Typography } from '@mui/material';

interface OverviewTableProps {
  columnDefs: ColDef[];
  defaultColDef: ColDef;
  context: any;
  loading: boolean;
  totalItems?: number;
  onRowClicked?: (id: string) => void;
  onGridReady?: (api: GridApi) => void;
  gridOptions?: GridOptions;
}

const OverviewTableComponent: React.FC<OverviewTableProps> = ({
  columnDefs,
  defaultColDef,
  context,
  loading,
  totalItems = 0,
  onRowClicked,
  onGridReady: externalGridReady,
  gridOptions
}) => {
  const gridRef = useRef<AgGridReact>(null);

  // Handle grid ready event
  const handleGridReady = useCallback((params: GridReadyEvent) => {
    console.log('Grid ready event triggered');

    if (externalGridReady) {
      externalGridReady(params.api);
    }
  }, [externalGridReady]);

  // Handle row clicked
  const handleRowClicked = useCallback((event: any) => {
    if (onRowClicked && event.data && event.data._id) {
      onRowClicked(event.data._id);
    }
  }, [onRowClicked]);

  return (
    <div className="ag-theme-material" style={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 0' }}>
        <Typography variant="subtitle1">
          {loading ? 'Loading...' : `${totalItems} items total`}
        </Typography>
      </div>

      <div style={{ flex: 1, width: '100%', minHeight: '500px' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          context={context}
          onGridReady={handleGridReady}
          onRowClicked={handleRowClicked}
          {...gridOptions}
        />
      </div>
    </div>
  );
};

// Export a memoized version of the component to prevent unnecessary re-renders
export const OverviewTable = memo(OverviewTableComponent);


