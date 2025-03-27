import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for debouncing a value
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for managing notification state
 */
export function useNotification() {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const showNotification = useCallback((message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  return { notification, showNotification, closeNotification };
}

/**
 * Custom hook for managing delete dialog state
 */
export function useDeleteDialog() {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemId: '',
    itemName: '',
    isDeleting: false
  });

  const openDeleteConfirm = useCallback((itemId: string, itemName: string) => {
    setDeleteDialog({
      open: true,
      itemId,
      itemName,
      isDeleting: false
    });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialog(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const setDeleting = useCallback((isDeleting: boolean) => {
    setDeleteDialog(prev => ({
      ...prev,
      isDeleting
    }));
  }, []);

  return {
    deleteDialog,
    openDeleteConfirm,
    closeDeleteDialog,
    setDeleting
  };
}