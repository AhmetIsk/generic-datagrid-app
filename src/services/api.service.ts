import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

/**
 * Base API configuration
 */
const API_BASE_URL = 'http://localhost:5001';
const API_TIMEOUT = 30000; // 30 seconds

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
  // Backward compatibility fields
  filter2?: string;
  operator2?: string;
  value2?: string;
  // New field for JSON filters
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
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Add request interceptor for logging or authentication
    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'An unexpected error occurred',
          status: error.response?.status,
        };

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorData = error.response.data as ServerErrorResponse;
          apiError.message = errorData.message || errorData.error || `Error: ${error.response.status}`;
          apiError.data = error.response.data;
        } else if (error.request) {
          // The request was made but no response was received
          apiError.message = 'No response received from server. Please check your connection.';
        } else {
          // Something happened in setting up the request that triggered an Error
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
      // Handle multiple filters if provided
      let queryParams = { ...params };

      // If we have multiple filters, serialize them to a JSON string
      if (params?.filters && params.filters.length > 0) {
        // Create clean filter objects without the ID (we don't need ID on the server)
        const cleanFilters = params.filters.map(filter => ({
          filter: filter.filter,
          operator: filter.operator,
          value: filter.value
        }));

        // Add as a JSON string parameter
        queryParams.filtersJson = JSON.stringify(cleanFilters);

        // Remove the original filters array to avoid confusion
        delete queryParams.filters;

        // Log what we're sending
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
   * Creates data for AG Grid server-side datasource
   * Handles the transformation from AG Grid's request format to our API format
   * @param request - AG Grid's request object
   * @returns Promise with data in AG Grid format
   */
  async getServerSideData(request: any): Promise<any> {
    try {
      // Calculate page and pageSize from startRow and endRow
      const pageSize = request.endRow - request.startRow;
      const page = Math.floor(request.startRow / pageSize) + 1;

      // Transform AG Grid request to API format
      const params: QueryParams = {
        page,
        pageSize
      };

      // Add sorting if present
      if (request.sortModel && request.sortModel.length > 0) {
        const sortField = request.sortModel[0].colId;
        const sortOrder = request.sortModel[0].sort;
        params.sortField = sortField;
        params.sortOrder = sortOrder as 'asc' | 'desc';
      }

      // Add filtering if present
      if (request.filterModel && Object.keys(request.filterModel).length > 0) {
        // Just for this example, we'll handle a single filter
        const filterField = Object.keys(request.filterModel)[0];
        if (filterField) {
          params.filter = filterField;
          const filterValue = request.filterModel[filterField].filter;
          params.value = filterValue;
          params.operator = 'contains'; // Default to contains
        }
      }

      // Make API request to get data
      const response = await this.getOverviewData(params);

      return {
        success: true,
        rows: response.rows || [],
        lastRow: response.lastRow || 0
      };
    } catch (error) {
      return {
        success: false,
        rows: [],
        lastRow: 0
      };
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Also export the class for testing purposes
export default ApiService;