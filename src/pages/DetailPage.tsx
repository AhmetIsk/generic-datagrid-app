import { useParams, useNavigate } from 'react-router-dom';
import {
  Button, Box, Paper, Typography, Breadcrumbs, CircularProgress,
  Link, Tooltip
} from '@mui/material';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import SpeedIcon from '@mui/icons-material/Speed';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationSnackbar from '../components/NotificationSnackbar';
import DeleteConfirmDialog from '../components/shared/DeleteConfirmDialog';
import VehicleHeader from '../components/detail/VehicleHeader';
import VehicleKeySpecs from '../components/detail/VehicleKeySpecs';
import VehicleDetailsSection from '../components/detail/VehicleDetailsSection';

// Styles for the component
const styles = {
  pageContainer: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  breadcrumbs: {
    marginBottom: '24px',
    padding: '8px 0'
  },
  breadcrumbIcon: {
    fontSize: '0.9rem',
    marginRight: '4px',
    color: 'var(--bmw-blue)'
  },
  breadcrumbLink: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--bmw-blue)',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  breadcrumbCurrent: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500
  },
  paper: {
    padding: '32px',
    marginBottom: '24px',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
  },
  loadingIcon: {
    color: 'var(--bmw-blue)',
    marginBottom: '16px'
  },
  loadingText: {
    color: '#4d4d4d'
  },
  errorPaper: {
    padding: '32px',
    borderRadius: '4px',
    borderLeft: '4px solid var(--bmw-error)'
  },
  errorHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  },
  errorIcon: {
    color: 'var(--bmw-error)',
    marginRight: '8px'
  },
  notFoundPaper: {
    padding: '32px',
    borderRadius: '4px',
    borderLeft: '4px solid var(--bmw-blue)'
  },
  notFoundHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  },
  notFoundIcon: {
    color: 'var(--bmw-blue)',
    marginRight: '8px'
  },
  backButton: {
    backgroundColor: 'var(--bmw-blue)',
    '&:hover': {
      backgroundColor: 'var(--bmw-dark-blue)'
    },
    padding: '8px 16px'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '1px solid #e6e6e6'
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px'
  },
  deleteButton: {
    borderColor: 'var(--bmw-error)',
    color: 'var(--bmw-error)',
    '&:hover': {
      backgroundColor: 'rgba(220, 0, 0, 0.04)',
      borderColor: 'var(--bmw-dark-red)'
    },
    padding: '8px 16px'
  },
  detailsTimestamp: {
    display: 'flex',
    alignItems: 'center',
    color: '#8e8e8e'
  },
  timestampIcon: {
    fontSize: '1rem',
    marginRight: '4px',
    color: '#8e8e8e'
  }
};

// Group fields into logical sections
const fieldGroups = {
  main: ['Brand', 'Model', 'Segment', 'BodyStyle', 'Date'],
  performance: ['AccelSec', 'TopSpeed_KmH', 'PowerTrain'],
  battery: ['Range_Km', 'Efficiency_WhKm', 'FastCharge_KmH', 'RapidCharge', 'PlugType'],
  misc: ['Seats', 'PriceEuro']
};

// Icons for section headings
const sectionIcons = {
  main: <DirectionsCarIcon />,
  performance: <SpeedIcon />,
  battery: <BatteryChargingFullIcon />,
  misc: <InfoIcon />
};

export const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    isDeleting: false
  });

  // State for notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getRecordById(id as string);
        setItemData(data);
      } catch (err) {
        setError('Failed to load item details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemData();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress size={60} sx={styles.loadingIcon} />
        <Typography variant="h6" sx={styles.loadingText}>
          Loading BMW vehicle details...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box p={3}>
        <Paper sx={styles.errorPaper}>
          <Box sx={styles.errorHeader}>
            <ErrorOutlineIcon color="error" fontSize="large" sx={styles.errorIcon} />
            <Typography color="error" variant="h5">Error Loading Details</Typography>
          </Box>
          <Typography variant="body1" paragraph>{error}</Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={styles.backButton}
          >
            Back to List
          </Button>
        </Paper>
      </Box>
    );
  }

  // Item not found state
  if (!itemData) {
    return (
      <Box p={3}>
        <Paper sx={styles.notFoundPaper}>
          <Box sx={styles.notFoundHeader}>
            <InfoIcon color="info" fontSize="large" sx={styles.notFoundIcon} />
            <Typography variant="h5">Vehicle Not Found</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            The requested BMW electric vehicle could not be found. It may have been removed or the ID is invalid.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={styles.backButton}
          >
            Back to List
          </Button>
        </Paper>
      </Box>
    );
  }

  // Extract vehicle data
  const brand = itemData.Brand || '';
  const model = itemData.Model || '';

  // Function to open delete confirmation dialog
  const openDeleteConfirm = () => {
    setDeleteDialog({
      open: true,
      isDeleting: false
    });
  };

  // Function to close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      ...deleteDialog,
      open: false
    });
  };

  // Function to handle actual deletion
  const handleDelete = async () => {
    if (!id) return;

    setDeleteDialog(prev => ({ ...prev, isDeleting: true }));

    try {
      await apiService.deleteRecord(id);

      // Show success notification
      showNotification(`${brand} ${model} was successfully deleted`, 'success');

      // Navigate back to the overview page
      navigate('/');
    } catch (err) {
      // Show error notification
      showNotification('Failed to delete the item. Please try again.', 'error');

      setDeleteDialog(prev => ({
        ...prev,
        isDeleting: false,
        open: false
      }));
    }
  };

  // Function to show notification
  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Function to close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Box sx={styles.pageContainer}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={styles.breadcrumbs}
      >
        <Link
          color="inherit"
          href="#"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          sx={styles.breadcrumbLink}
        >
          <ElectricCarIcon sx={styles.breadcrumbIcon} fontSize="small" />
          BMW Electric Cars
        </Link>
        <Typography
          color="text.primary"
          sx={styles.breadcrumbCurrent}
        >
          {brand} {model}
        </Typography>
      </Breadcrumbs>

      <Paper sx={styles.paper}>
        {/* Header with car name and price */}
        <VehicleHeader
          brand={brand}
          model={model}
          bodyStyle={itemData.BodyStyle}
          segment={itemData.Segment}
          price={itemData.PriceEuro}
        />

        {/* Key specifications highlights */}
        <VehicleKeySpecs
          range={itemData.Range_Km}
          acceleration={itemData.AccelSec}
          topSpeed={itemData.TopSpeed_KmH}
          fastCharge={itemData.FastCharge_KmH}
        />

        {/* Vehicle Details Sections */}
        <VehicleDetailsSection
          title="Vehicle Information"
          icon={sectionIcons.main}
          fields={fieldGroups.main}
          itemData={itemData}
        />

        <VehicleDetailsSection
          title="Performance"
          icon={sectionIcons.performance}
          fields={fieldGroups.performance}
          itemData={itemData}
        />

        <VehicleDetailsSection
          title="Battery & Charging"
          icon={sectionIcons.battery}
          fields={fieldGroups.battery}
          itemData={itemData}
        />

        <VehicleDetailsSection
          title="Additional Information"
          icon={sectionIcons.misc}
          fields={fieldGroups.misc}
          itemData={itemData}
        />

        {/* Action Buttons */}
        <Box sx={styles.actionButtons}>
          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={styles.backButton}
            >
              Back to List
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={openDeleteConfirm}
              sx={styles.deleteButton}
            >
              Delete
            </Button>
          </Box>

          <Tooltip title="Vehicle details as of data collection date">
            <Typography
              variant="caption"
              sx={styles.detailsTimestamp}
            >
              <EventIcon fontSize="small" sx={styles.timestampIcon} />
              {itemData.Date ? `Data updated: ${new Date(itemData.Date).toLocaleDateString()}` : 'Date unavailable'}
            </Typography>
          </Tooltip>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        itemName={`${brand} ${model}`}
        isDeleting={deleteDialog.isDeleting}
        onCancel={closeDeleteDialog}
        onConfirm={handleDelete}
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
        duration={4000}
      />
    </Box>
  );
};
