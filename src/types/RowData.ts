/**
 * Generic row data interface that can be used to extend various data types
 * with common properties needed for AG Grid operations
 */
export interface RowData<T> {
  id: string;
  data: T;
  [key: string]: any;
}