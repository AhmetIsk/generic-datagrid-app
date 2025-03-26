import { IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import { apiService } from './api.service';

/**
 * Implementation of AG Grid's server-side datasource
 */
export class GridDatasourceService implements IServerSideDatasource {
  /**
   * AG Grid calls this method when more rows are required
   */
  getRows(params: IServerSideGetRowsParams): void {
    // Convert AG Grid parameters to our API format
    const request = params.request || {};
    const startRow = request.startRow || 0;
    const endRow = request.endRow || 20;
    const pageSize = endRow - startRow;
    const page = Math.floor(startRow / pageSize) + 1;

    // Call the API service
    apiService.getOverviewData({
      page: page,
      pageSize: pageSize
    })
      .then(response => {
        if (response.success && Array.isArray(response.rows)) {
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow || 0
          });
        } else {
          console.error('Invalid response format:', response);
          params.fail();
        }
      })
      .catch((error) => {
        console.error('GridDatasource error:', error);
        params.fail();
      });
  }

  destroy(): void {
    // Cleanup method required by the interface
  }
}

/**
 * Factory function for creating datasource instance
 */
export function createGridDatasource(): IServerSideDatasource {
  return new GridDatasourceService();
}

// Create an instance before export
const gridDatasourceServiceInstance = new GridDatasourceService();

// Default export for direct use
export default gridDatasourceServiceInstance;