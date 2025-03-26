import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { ICellRendererParams } from 'ag-grid-community';
import { apiService } from '../services/api.service';

interface ActionProps {
  id: string;
  navigate: (path: string) => void;
  onDelete: (id: string) => Promise<void>;
  onError: (message: string) => void;
  refreshGrid: () => void;
}

// View button component
const ViewButton = ({ id, navigate }: Pick<ActionProps, 'id' | 'navigate'>) => (
  <IconButton
    size="small"
    color="primary"
    onClick={() => navigate(`/detail/${id}`)}
    aria-label="view"
    sx={{ padding: '4px', marginRight: '4px' }}
  >
    <VisibilityIcon fontSize="small" />
  </IconButton>
);

// Delete button component
const DeleteButton = ({ id, onDelete, onError, refreshGrid }: Omit<ActionProps, 'navigate'>) => (
  <IconButton
    size="small"
    color="error"
    onClick={async () => {
      try {
        await onDelete(id);
        refreshGrid();
      } catch (err) {
        onError('Failed to delete item. Please try again.');
      }
    }}
    aria-label="delete"
    sx={{ padding: '4px' }}
  >
    <DeleteIcon fontSize="small" />
  </IconButton>
);

export const ActionCellRenderer = (props: ICellRendererParams) => {
  const navigate = useNavigate();

  if (!props.data || !props.data._id) return null;

  const id = props.data._id;
  const setError = props.context?.setError || (() => { });
  const refreshGrid = props.context?.refreshGrid || (() => { });

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" height="100%">
      <ViewButton id={id} navigate={navigate} />
      <DeleteButton
        id={id}
        onDelete={(id) => apiService.deleteRecord(id)}
        onError={setError}
        refreshGrid={refreshGrid}
      />
    </Stack>
  );
};

export default ActionCellRenderer;