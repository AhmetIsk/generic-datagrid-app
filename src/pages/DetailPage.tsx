import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Paper, Typography, Grid, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
        const response = await axios.get(`http://localhost:5001/api/data/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setItemData(response.data);
      } catch (err) {
        console.error('Error fetching item details:', err);
        setError('Failed to load item details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemData();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

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
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </Typography>
                <Typography variant="body1">
                  {value === true ? 'Yes' :
                    value === false ? 'No' :
                      value === null ? 'N/A' :
                        String(value)}
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
