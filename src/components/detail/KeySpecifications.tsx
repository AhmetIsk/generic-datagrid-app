import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

interface Specification {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
}

interface KeySpecificationsProps {
  specifications: Specification[];
}

const KeySpecifications: React.FC<KeySpecificationsProps> = ({ specifications }) => {
  return (
    <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 0 }}>
      <Grid container spacing={3}>
        {specifications.map((spec, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#262626' }}>
                {spec.label}
              </Typography>
              <Typography variant="h6" sx={{ color: '#262626' }}>
                {spec.value ? `${spec.value}${spec.unit ? ' ' + spec.unit : ''}` : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KeySpecifications;
