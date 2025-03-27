import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { formatValue, getFieldLabel } from '../../utils/formatters';

const styles = {
  sectionContainer: {
    marginBottom: '32px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e6e6e6'
  },
  sectionIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bmw-blue)',
    color: '#ffffff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '12px'
  },
  sectionTitle: {
    fontWeight: 500,
    color: '#262626',
    fontSize: '1.25rem'
  },
  fieldPaper: {
    padding: '16px',
    height: '100%',
    border: '1px solid #e6e6e6',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    transition: 'box-shadow 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
    }
  },
  fieldLabel: {
    color: '#8e8e8e',
    display: 'block',
    marginBottom: '6px',
    fontWeight: 500,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  fieldValue: {
    color: '#262626',
    fontWeight: 400,
    fontSize: '1rem'
  }
};

interface VehicleDetailsSectionProps {
  title: string;
  icon: React.ReactNode;
  fields: string[];
  itemData: Record<string, any>;
}

const VehicleDetailsSection: React.FC<VehicleDetailsSectionProps> = ({
  title,
  icon,
  fields,
  itemData
}) => {
  const filteredFields = fields.filter(field => itemData[field] !== undefined);

  if (filteredFields.length === 0) return null;

  const renderField = (key: string) => {
    if (key === '_id' || key === '__v') return null;

    const value = itemData[key];
    const formattedValue = formatValue(key, value);

    return (
      <Grid item xs={12} sm={6} md={4} key={key}>
        <Paper
          elevation={0}
          sx={styles.fieldPaper}
        >
          <Typography
            variant="caption"
            sx={styles.fieldLabel}
          >
            {getFieldLabel(key)}
          </Typography>
          <Typography
            variant="body1"
            sx={styles.fieldValue}
          >
            {formattedValue}
          </Typography>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={styles.sectionContainer}>
      <Box
        sx={styles.sectionHeader}
      >
        <Box sx={styles.sectionIcon}>
          {icon}
        </Box>
        <Typography variant="h6" sx={styles.sectionTitle}>
          {title}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {filteredFields.map(field => renderField(field))}
      </Grid>
    </Box>
  );
};

export default VehicleDetailsSection;
