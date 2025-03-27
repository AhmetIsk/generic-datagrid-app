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
          const pageSize = params.endRow - params.startRow;
          const page = Math.floor(params.startRow / pageSize) + 1;

          const queryParams: QueryParams = {
            page,
            pageSize
          };

          if (params.sortModel && params.sortModel.length > 0) {
            queryParams.sortField = params.sortModel[0].colId;
            queryParams.sortOrder = params.sortModel[0].sort as 'asc' | 'desc';
          }

          if (params.filterModel && Object.keys(params.filterModel).length > 0) {
            const filterField = Object.keys(params.filterModel)[0];
            if (filterField) {
              queryParams.filter = filterField;
              queryParams.value = params.filterModel[filterField].filter;
              queryParams.operator = 'contains';
            }
          }

          const response = await apiService.getOverviewData(queryParams);

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
          const { request } = params;

          const startRow = request.startRow ?? 0;
          const endRow = request.endRow ?? 100;
          const pageSize = endRow - startRow || 20;
          const page = Math.floor(startRow / pageSize) + 1;

          const queryParams: QueryParams = {
            page,
            pageSize
          };

          if (request.sortModel && request.sortModel.length > 0) {
            queryParams.sortField = request.sortModel[0].colId;
            queryParams.sortOrder = request.sortModel[0].sort as 'asc' | 'desc';
          }

          if (options?.search && options.search.trim() !== '') {
            queryParams.search = options.search.trim();
            console.log(`Adding search parameter: ${queryParams.search}`);
          }

          if (options?.filters && options.filters.length > 0) {
            queryParams.filters = options.filters;
            console.log(`Sending ${options.filters.length} filters to the backend:`, options.filters);
          }

          console.log('Sending request with params:', queryParams);
          const response: OverviewResponse = await apiService.getOverviewData(queryParams);
          console.log('Received response:', response);

          if (response && response.success) {
            const rowData = response.rows || [];
            const rowCount = response.lastRow || 0;

            params.success({
              rowData,
              rowCount,
            });

            if (rowData.length === 0) {
              console.log('No results found for the current search/filter criteria');
            }
          } else {
            params.success({
              rowData: [],
              rowCount: 0
            });
          }
        } catch (error) {
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

export const gridDatasourceService = new GridDatasourceService();

export default GridDatasourceService;