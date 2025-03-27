import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { ICellRendererParams } from 'ag-grid-community';

/**
 * ActionCellRenderer - Provides view and delete buttons for grid rows
 */
export const ActionCellRenderer = (props: ICellRendererParams) => {
  const navigate = useNavigate();

  if (!props.data || !props.data._id) return null;

  const id = props.data._id;
  const openDeleteConfirm = props.context?.openDeleteConfirm || (() => { });

  // Get item name for the delete confirmation dialog
  const brand = props.data.Brand || '';
  const model = props.data.Model || '';
  const itemName = brand && model ? `${brand} ${model}` : 'this item';

  // View button handler
  const handleView = () => {
    navigate(`/detail/${id}`);
  };

  // Delete button handler - delegates to parent context
  const handleDeleteClick = () => {
    openDeleteConfirm(id, itemName);
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      {/* View button */}
      <IconButton
        size="small"
        color="primary"
        onClick={handleView}
        aria-label="view"
        sx={{ mr: 1 }}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>

      {/* Delete button */}
      <IconButton
        size="small"
        color="error"
        onClick={handleDeleteClick}
        aria-label="delete"
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

export default ActionCellRenderer;
