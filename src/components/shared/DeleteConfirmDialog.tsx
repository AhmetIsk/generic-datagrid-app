import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Styles for the component
const styles = {
  dialogPaper: {
    borderTop: '4px solid #dc0000',
    borderRadius: 0,
    overflow: 'hidden'
  },
  dialogTitle: {
    paddingBottom: 0,
    backgroundColor: '#262626',
    color: '#ffffff'
  },
  dialogTitleContent: {
    display: 'flex',
    alignItems: 'center'
  },
  dialogTitleIcon: {
    color: '#dc0000',
    marginRight: '8px',
    fontSize: '28px'
  },
  dialogTitleText: {
    fontWeight: 500
  },
  dialogContent: {
    color: '#262626',
    marginTop: '8px',
    marginBottom: '8px',
    padding: '24px'
  },
  dialogActions: {
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '16px'
  },
  cancelButton: {
    color: '#262626',
    '&:hover': {
      backgroundColor: '#e6e6e6'
    }
  },
  deleteButton: {
    backgroundColor: '#dc0000',
    '&:hover': {
      backgroundColor: '#b50000'
    }
  }
};

interface DeleteConfirmDialogProps {
  open: boolean;
  itemName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Reusable confirmation dialog for delete operations
 */
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  itemName,
  isDeleting,
  onCancel,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onCancel}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      PaperProps={{
        sx: styles.dialogPaper
      }}
    >
      <DialogTitle id="delete-dialog-title" sx={styles.dialogTitle}>
        <Box sx={styles.dialogTitleContent}>
          <WarningAmberIcon sx={styles.dialogTitleIcon} />
          <Typography variant="h6" component="span" sx={styles.dialogTitleText}>
            Confirm Deletion
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description" sx={styles.dialogContent}>
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onCancel}
          disabled={isDeleting}
          sx={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={<DeleteIcon />}
          sx={styles.deleteButton}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
