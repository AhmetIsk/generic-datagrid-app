import { IDatasource, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import { apiService, OverviewResponse, ApiError, QueryParams, FilterItem } from './api.service';

/**
 * Interface for additional filter options on server-side data source
 */
export interface FilterOptions {
  search?: string;
  filters?: FilterItem[];
}

/**
 * Service that provides AG Grid compatible datasource
 * for server-side operations
 */
export class GridDatasourceService {
  /**
   * Creates a datasource for AG Grid client-side usage
   */
  createDatasource(): IDatasource {
    return {
      getRows: async (params) => {
        try {
          // Transform the request parameters to use only page/pageSize
          const pageSize = params.endRow - params.startRow;
          const page = Math.floor(params.startRow / pageSize) + 1;

          const queryParams: QueryParams = {
            page,
            pageSize
          };

          // Add sorting if present
          if (params.sortModel && params.sortModel.length > 0) {
            queryParams.sortField = params.sortModel[0].colId;
            queryParams.sortOrder = params.sortModel[0].sort as 'asc' | 'desc';
          }

          // Add filtering if present
          if (params.filterModel && Object.keys(params.filterModel).length > 0) {
            // We only handle simple filters for now
            const filterField = Object.keys(params.filterModel)[0];
            if (filterField) {
              queryParams.filter = filterField;
              queryParams.value = params.filterModel[filterField].filter;
              queryParams.operator = 'contains'; // Default
            }
          }

          // Make the API call
          const response = await apiService.getOverviewData(queryParams);

          // Return the rows to the grid
          params.successCallback(response.rows, response.lastRow);
        } catch (error) {
          console.error('Error fetching data:', error);
          params.failCallback();
        }
      }
    };
  }

  /**
   * Creates a server-side datasource for AG Grid Enterprise
   * This handles the server-side row model requirements
   * @param options Additional filter options (search, filter, etc.)
   */
  createServerSideDatasource(options?: FilterOptions): IServerSideDatasource {
    return {
      getRows: async (params: IServerSideGetRowsParams) => {
        console.log('ServerSide getRows called with params:', params);
        console.log('Filter options:', options);

        try {
          // 1. Extract the request model
          const { request } = params;

          // Default values for startRow and endRow if they're undefined
          const startRow = request.startRow ?? 0;
          const endRow = request.endRow ?? 100;
          const pageSize = endRow - startRow || 20; // Fallback to 20 if calculation is 0
          const page = Math.floor(startRow / pageSize) + 1;

          // 2. Create query parameters - only using page and pageSize now
          const queryParams: QueryParams = {
            page,
            pageSize
          };

          // 3. Add sorting from AG Grid's sort model
          if (request.sortModel && request.sortModel.length > 0) {
            queryParams.sortField = request.sortModel[0].colId;
            queryParams.sortOrder = request.sortModel[0].sort as 'asc' | 'desc';
          }

          // 4. Add search from options
          if (options?.search && options.search.trim() !== '') {
            queryParams.search = options.search.trim();
            console.log(`Adding search parameter: ${queryParams.search}`);
          }

          // 5. Handle multiple filters
          if (options?.filters && options.filters.length > 0) {
            // Add filters array to query params
            queryParams.filters = options.filters;
            console.log(`Sending ${options.filters.length} filters to the backend:`, options.filters);
          }

          // 6. Make API call
          console.log('Sending request with params:', queryParams);
          const response: OverviewResponse = await apiService.getOverviewData(queryParams);
          console.log('Received response:', response);

          // 7. Return the rows to AG Grid
          if (response && response.success) {
            const rowData = response.rows || [];
            const rowCount = response.lastRow || 0;

            // Success - return the rows and last row to AG Grid
            params.success({
              rowData,
              rowCount,
            });

            // Log if no results were found
            if (rowData.length === 0) {
              console.log('No results found for the current search/filter criteria');
            }
          } else {
            // Something went wrong - but still return empty results
            // instead of failing completely
            params.success({
              rowData: [],
              rowCount: 0
            });
          }
        } catch (error) {
          // Handle error but still return empty results
          // so the no-rows overlay can be displayed
          console.error('Error in ServerSide getRows:', error);
          const apiError = error as ApiError;
          params.success({
            rowData: [],
            rowCount: 0
          });
        }
      }
    };
  }
}

// Export singleton instance
export const gridDatasourceService = new GridDatasourceService();

// Also export the class for testing
export default GridDatasourceService;