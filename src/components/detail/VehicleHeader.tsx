import React from 'react';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EuroIcon from '@mui/icons-material/Euro';

// Styles for the component
const styles = {
  vehicleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  headerContent: {
    flex: '1 1 auto'
  },
  title: {
    color: 'var(--bmw-black)',
    fontWeight: 600,
    marginBottom: '16px',
    fontSize: '2rem'
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  bodyStyleChip: {
    backgroundColor: 'var(--bmw-blue)',
    color: 'var(--bmw-white)',
    fontWeight: 500,
    height: '32px',
    borderRadius: '16px',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '0.5px',
    '& .MuiChip-icon': {
      color: 'var(--bmw-white)'
    }
  },
  bodyStyleIcon: {
    color: 'var(--bmw-white) !important',
    fontSize: '1rem',
    marginRight: '4px'
  },
  segmentChip: {
    borderColor: 'var(--bmw-light-gray)',
    color: 'var(--bmw-dark-gray)',
    height: '32px',
    borderRadius: '16px',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    letterSpacing: '0.5px'
  },
  priceCard: {
    minWidth: '200px',
    borderRadius: '4px',
    backgroundColor: 'var(--bmw-white)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid var(--bmw-light-gray)'
  },
  priceContent: {
    padding: '16px',
    '&:last-child': {
      paddingBottom: '16px'
    }
  },
  priceLabel: {
    color: 'var(--bmw-dark-gray)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.75rem'
  },
  priceValue: {
    color: 'var(--bmw-blue)',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    fontSize: '2rem'
  },
  priceIcon: {
    marginRight: '4px',
    fontSize: '1.5rem'
  }
};

interface VehicleHeaderProps {
  brand: string;
  model: string;
  bodyStyle?: string;
  segment?: string;
  price?: number;
}

const VehicleHeader: React.FC<VehicleHeaderProps> = ({
  brand,
  model,
  bodyStyle,
  segment,
  price
}) => {
  return (
    <Box sx={styles.vehicleHeader}>
      <Box sx={styles.headerContent}>
        <Typography
          variant="h3"
          sx={styles.title}
        >
          {brand} {model}
        </Typography>

        <Box sx={styles.chipContainer}>
          {bodyStyle && (
            <Chip
              icon={<DirectionsCarIcon fontSize="small" />}
              label={bodyStyle}
              sx={styles.bodyStyleChip}
              size="medium"
            />
          )}

          {segment && (
            <Chip
              label={segment}
              variant="outlined"
              size="small"
              sx={styles.segmentChip}
            />
          )}
        </Box>
      </Box>

      <Card sx={styles.priceCard}>
        <CardContent sx={styles.priceContent}>
          <Typography variant="overline" sx={styles.priceLabel}>
            PRICE
          </Typography>
          <Typography variant="h5" sx={styles.priceValue}>
            <EuroIcon sx={styles.priceIcon} />
            {price ? price.toLocaleString() : 'N/A'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VehicleHeader;
