/**
 * Utility types and functions for dialog management
 */

// Dialog state interface
export interface DeleteDialogState {
  open: boolean;
  itemId: string;
  itemName: string;
  isDeleting: boolean;
}

// Initial delete dialog state
export const initialDeleteDialogState: DeleteDialogState = {
  open: false,
  itemId: '',
  itemName: '',
  isDeleting: false
};

// Notification state interface
export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

// Initial notification state
export const initialNotificationState: NotificationState = {
  open: false,
  message: '',
  severity: 'success'
};

/**
 * Creates a delete dialog state with the specified item details
 */
export const createDeleteDialogState = (
  itemId: string,
  itemName: string
): DeleteDialogState => ({
  open: true,
  itemId,
  itemName,
  isDeleting: false
});

/**
 * Creates a notification state with the specified message and severity
 */
export const createNotificationState = (
  message: string,
  severity: 'success' | 'error' | 'info' | 'warning'
): NotificationState => ({
  open: true,
  message,
  severity
});