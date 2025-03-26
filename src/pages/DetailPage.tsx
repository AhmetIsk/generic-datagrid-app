import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';

export const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box p={3}>
        <Paper sx={{ p: 3, bgcolor: '#ffebee' }}>
          <Typography color="error" variant="h6">{error}</Typography>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
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
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Item not found</Typography>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Back to List
          </Button>
        </Paper>
      </Box>
    );
  }

  // Format a field name from camelCase to Title Case with spaces
  const formatFieldName = (key: string) =>
    key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

  // Format a field value based on its type
  const formatFieldValue = (value: any) => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (value === null) return 'N/A';
    return String(value);
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {itemData.Brand} {itemData.Model}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {Object.entries(itemData).map(([key, value]) =>
            key !== '_id' && key !== '__v' ? (
              <Grid item xs={6} sm={4} key={key}>
                <Typography variant="subtitle2" color="text.secondary">
                  {formatFieldName(key)}
                </Typography>
                <Typography variant="body1">
                  {formatFieldValue(value)}
                </Typography>
              </Grid>
            ) : null
          )}
        </Grid>

        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 4 }}>
          Back to List
        </Button>
      </Paper>
    </Box>
  );
};
