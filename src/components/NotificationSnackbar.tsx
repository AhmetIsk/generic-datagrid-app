import React from 'react';
import { Snackbar, Alert, AlertColor, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Styles for the component
const styles = {
  snackbar: {
    minWidth: '320px',
    borderRadius: 0,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)'
  },
  successAlert: {
    backgroundColor: '#262626',
    color: '#ffffff',
    borderLeft: '4px solid #00934a'
  },
  errorAlert: {
    backgroundColor: '#262626',
    color: '#ffffff',
    borderLeft: '4px solid #dc0000'
  },
  warningAlert: {
    backgroundColor: '#262626',
    color: '#ffffff',
    borderLeft: '4px solid #f9ba00'
  },
  infoAlert: {
    backgroundColor: '#262626',
    color: '#ffffff',
    borderLeft: '4px solid #1c69d4'
  },
  message: {
    width: '100%'
  },
  alertTitle: {
    fontWeight: 'bold'
  },
  alertText: {
    marginTop: '4px'
  },
  actionButton: {
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  }
};

// Interface for the NotificationSnackbar props
export interface NotificationProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'success' | 'info' | 'warning' | 'error'
  duration?: number;
  onClose: () => void;
  title?: string;
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}

/**
 * A reusable notification snackbar component
 * Can be used to display success, error, info, and warning messages
 */
const NotificationSnackbar: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'info',
  duration = 5000,
  onClose,
  title,
  vertical = 'bottom',
  horizontal = 'center'
}) => {
  // Get appropriate icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleOutlineIcon />;
      case 'error':
        return <ErrorOutlineIcon />;
      case 'warning':
        return <WarningAmberIcon />;
      case 'info':
      default:
        return <InfoOutlinedIcon />;
    }
  };

  // Default titles based on severity if none provided
  const getDefaultTitle = () => {
    if (title) return title;

    switch (severity) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
      default:
        return 'Information';
    }
  };

  // Generate the appropriate styles for the alert based on severity
  const getAlertStyle = () => {
    switch (severity) {
      case 'success':
        return styles.successAlert;
      case 'error':
        return styles.errorAlert;
      case 'warning':
        return styles.warningAlert;
      case 'info':
      default:
        return styles.infoAlert;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
    >
      <Alert
        severity={severity}
        variant="filled"
        icon={getIcon()}
        sx={{ ...styles.snackbar, ...getAlertStyle() }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
            sx={styles.actionButton}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Box sx={styles.message}>
          <Typography variant="subtitle2" sx={styles.alertTitle}>
            {getDefaultTitle()}
          </Typography>
          <Typography variant="body2" sx={styles.alertText}>
            {message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
