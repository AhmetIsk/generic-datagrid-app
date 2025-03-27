import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import BoltIcon from '@mui/icons-material/Bolt';

// Styles for the component
const styles = {
  specsContainer: {
    backgroundColor: '#f5f5f5',
    padding: '24px',
    marginBottom: '32px',
    borderRadius: '4px'
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '12px 16px'
  },
  specHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(var(--bmw-blue-rgb), 0.1)',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    marginRight: '12px'
  },
  specIcon: {
    color: 'var(--bmw-blue)',
    fontSize: '1.4rem'
  },
  specLabel: {
    color: 'var(--bmw-dark-gray)',
    fontWeight: 500,
    fontSize: '0.9rem'
  },
  specValueContainer: {
    display: 'flex',
    alignItems: 'baseline',
    marginLeft: '48px' // Match the icon width + margin to align with the icon
  },
  specValue: {
    color: 'var(--bmw-black)',
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.2
  },
  specUnit: {
    fontSize: '0.9rem',
    color: 'var(--bmw-gray)',
    marginLeft: '4px',
    fontWeight: 400
  }
};

interface VehicleKeySpecsProps {
  range?: number;
  acceleration?: number;
  topSpeed?: number;
  fastCharge?: number;
}

const VehicleKeySpecs: React.FC<VehicleKeySpecsProps> = ({
  range,
  acceleration,
  topSpeed,
  fastCharge
}) => {
  return (
    <Box sx={styles.specsContainer}>
      <Grid container spacing={2}>
        {/* Range */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={styles.specItem}>
            <Box sx={styles.specHeader}>
              <Box sx={styles.iconContainer}>
                <BatteryChargingFullIcon sx={styles.specIcon} />
              </Box>
              <Typography sx={styles.specLabel}>
                Range
              </Typography>
            </Box>
            <Box sx={styles.specValueContainer}>
              <Typography sx={styles.specValue}>
                {range || 'N/A'}
              </Typography>
              {range && <Typography component="span" sx={styles.specUnit}>km</Typography>}
            </Box>
          </Box>
        </Grid>

        {/* Acceleration */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={styles.specItem}>
            <Box sx={styles.specHeader}>
              <Box sx={styles.iconContainer}>
                <BoltIcon sx={styles.specIcon} />
              </Box>
              <Typography sx={styles.specLabel}>
                Acceleration
              </Typography>
            </Box>
            <Box sx={styles.specValueContainer}>
              <Typography sx={styles.specValue}>
                {acceleration || 'N/A'}
              </Typography>
              {acceleration && <Typography component="span" sx={styles.specUnit}>sec</Typography>}
            </Box>
          </Box>
        </Grid>

        {/* Top Speed */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={styles.specItem}>
            <Box sx={styles.specHeader}>
              <Box sx={styles.iconContainer}>
                <SpeedIcon sx={styles.specIcon} />
              </Box>
              <Typography sx={styles.specLabel}>
                Top Speed
              </Typography>
            </Box>
            <Box sx={styles.specValueContainer}>
              <Typography sx={styles.specValue}>
                {topSpeed || 'N/A'}
              </Typography>
              {topSpeed && <Typography component="span" sx={styles.specUnit}>km/h</Typography>}
            </Box>
          </Box>
        </Grid>

        {/* Fast Charge */}
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={styles.specItem}>
            <Box sx={styles.specHeader}>
              <Box sx={styles.iconContainer}>
                <ElectricBoltIcon sx={styles.specIcon} />
              </Box>
              <Typography sx={styles.specLabel}>
                Fast Charge
              </Typography>
            </Box>
            <Box sx={styles.specValueContainer}>
              <Typography sx={styles.specValue}>
                {fastCharge || 'N/A'}
              </Typography>
              {fastCharge && <Typography component="span" sx={styles.specUnit}>km/h</Typography>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VehicleKeySpecs;
