import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

/**
 * Base API configuration
 */
const API_BASE_URL = 'http://localhost:5001';
const API_TIMEOUT = 30000;

/**
 * Interface for handling server errors
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

/**
 * Interface for pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  startRow?: number;
  endRow?: number;
}

/**
 * Interface for filter parameters
 */
export interface FilterParams {
  filter?: string;
  operator?: string;
  value?: string;
  filterModel?: any;
  filter2?: string;
  operator2?: string;
  value2?: string;
  filtersJson?: string;
}

/**
 * Interface for a single filter
 */
export interface FilterItem {
  id: string;
  filter: string;
  operator: string;
  value: string;
}

/**
 * Interface for multiple filters
 */
export interface MultiFilterParams {
  filters?: FilterItem[];
}

/**
 * Interface for sort parameters
 */
export interface SortParams {
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  sortModel?: any;
}

/**
 * Interface for search parameters
 */
export interface SearchParams {
  search?: string;
}

/**
 * Combined query parameters interface
 */
export type QueryParams = PaginationParams & FilterParams & SortParams & SearchParams & MultiFilterParams;

/**
 * API response interface for overview data
 */
export interface OverviewResponse {
  success: boolean;
  rows: any[];
  lastRow: number;
  pagination?: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

/**
 * Interface for server response with error message
 */
export interface ServerErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  [key: string]: any;
}

/**
 * Main API service class that encapsulates all backend API calls
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status,
        };

        if (error.response) {
          const errorData = error.response.data as ServerErrorResponse;
          apiError.message = errorData.message || errorData.error || `Error: ${error.response.status}`;
          apiError.data = error.response.data;
        } else if (error.request) {
          apiError.message = 'No response received from server. Please check your connection.';
        } else {
          apiError.message = error.message;
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Get all data with optional filtering
   * @param params - Query parameters
   * @returns Promise with data
   */
  async getAllData(params?: QueryParams): Promise<any[]> {
    try {
      const response: AxiosResponse = await this.api.get('/api/data', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get paginated overview data with only specified fields
   * @param params - Query parameters
   * @returns Promise with paginated data
   */
  async getOverviewData(params?: QueryParams): Promise<OverviewResponse> {
    try {
      let queryParams = { ...params };

      if (params?.filters && params.filters.length > 0) {
        const cleanFilters = params.filters.map(filter => ({
          filter: filter.filter,
          operator: filter.operator,
          value: filter.value
        }));

        queryParams.filtersJson = JSON.stringify(cleanFilters);

        delete queryParams.filters;

        console.log('Sending filters as JSON:', queryParams.filtersJson);
      }

      const response: AxiosResponse = await this.api.get('/api/data/overview', { params: queryParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get single record by ID
   * @param id - Record ID
   * @returns Promise with single record
   */
  async getRecordById(id: string): Promise<any> {
    try {
      const response: AxiosResponse = await this.api.get(`/api/data/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete record by ID
   * @param id - Record ID
   * @returns Promise with deletion status
   */
  async deleteRecord(id: string): Promise<void> {
    try {
      await this.api.delete(`/api/data/${id}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Seed the database with data
   * @param data - Array of data to seed
   * @returns Promise with seed status
   */
  async seedData(data: any[]): Promise<any> {
    try {
      const response: AxiosResponse = await this.api.post('/api/seed', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get data in AG Grid datasource format
   * @param params - AG Grid datasource params
   * @returns Promise with AG Grid friendly response
   */
  async getGridData(params: any): Promise<any> {
    try {
      if (params.startRow !== undefined && params.endRow !== undefined) {
        const page = Math.floor(params.startRow / (params.endRow - params.startRow)) + 1;
        const pageSize = params.endRow - params.startRow;

        const queryParams: QueryParams = {
          page,
          pageSize,
        };

        if (params.sortModel && params.sortModel.length > 0) {
          const sort = params.sortModel[0];
          queryParams.sortField = sort.colId;
          queryParams.sortOrder = sort.sort;
        }

        if (params.filterModel) {
          const filterKeys = Object.keys(params.filterModel);
          if (filterKeys.length > 0) {
            const firstFilterKey = filterKeys[0];
            const filter = params.filterModel[firstFilterKey];

            queryParams.filter = firstFilterKey;
            queryParams.value = filter.filter;
            queryParams.operator = 'contains';
          }
        }

        const data = await this.getOverviewData(queryParams);

        return {
          success: true,
          rows: data.rows,
          lastRow: data.lastRow || data.rows.length,
        };
      }

      return { success: false, message: 'Invalid parameters' };
    } catch (error) {
      return { success: false, message: 'Error fetching data' };
    }
  }
}

export const apiService = new ApiService();

export { ApiService };