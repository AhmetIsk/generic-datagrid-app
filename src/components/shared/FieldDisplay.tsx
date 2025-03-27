import React from 'react';
import { Typography, Box } from '@mui/material';
import { formatValue, getFieldLabel } from '../../utils/formatters';

const styles = {
  fieldLabel: {
    color: 'var(--bmw-gray)',
    display: 'block',
    marginBottom: '6px',
    fontWeight: 500,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  fieldValue: {
    color: 'var(--bmw-black)',
    fontWeight: 400,
    fontSize: '1rem'
  }
};

interface FieldDisplayProps {
  fieldKey: string;
  value: any;
  className?: string;
}

/**
 * A reusable component for displaying a field with label and formatted value
 */
const FieldDisplay: React.FC<FieldDisplayProps> = ({ fieldKey, value, className }) => {
  if (fieldKey === '_id' || fieldKey === '__v') return null;

  const formattedValue = formatValue(fieldKey, value);
  const label = getFieldLabel(fieldKey);

  return (
    <Box className={className}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={styles.fieldLabel}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={styles.fieldValue}
      >
        {formattedValue}
      </Typography>
    </Box>
  );
};

export default FieldDisplay;
