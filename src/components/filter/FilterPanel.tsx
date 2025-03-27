import React, { memo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { FilterItem } from '../../services/api.service';

// Styles for the component
const styles = {
  filterPaper: {
    padding: '24px',
    border: '1px solid #e6e6e6',
    marginBottom: '24px'
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  },
  filterIcon: {
    marginRight: '8px',
    color: '#1c69d4'
  },
  filterTitle: {
    fontWeight: 500,
    color: '#262626'
  },
  searchIcon: {
    marginRight: '8px',
    color: '#8e8e8e'
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      '& fieldset': {
        borderColor: '#e6e6e6'
      },
      '&:hover fieldset': {
        borderColor: '#8e8e8e'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1c69d4'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#8e8e8e',
      '&.Mui-focused': {
        color: '#1c69d4'
      }
    }
  },
  select: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      '& fieldset': {
        borderColor: '#e6e6e6'
      },
      '&:hover fieldset': {
        borderColor: '#8e8e8e'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1c69d4'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#8e8e8e',
      '&.Mui-focused': {
        color: '#1c69d4'
      }
    }
  },
  applyButton: {
    backgroundColor: '#1c69d4',
    '&:hover': {
      backgroundColor: '#0653b6'
    },
    '&.Mui-disabled': {
      backgroundColor: '#e6e6e6',
      color: '#8e8e8e'
    }
  },
  filtersContainer: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #e6e6e6'
  },
  filtersTitle: {
    color: '#4d4d4d',
    marginBottom: '8px'
  },
  filterChip: {
    margin: '4px',
    backgroundColor: 'transparent',
    border: '1px solid #1c69d4',
    color: '#1c69d4',
    '&:hover': {
      backgroundColor: 'rgba(28, 105, 212, 0.1)'
    }
  },
  clearChip: {
    margin: '4px',
    cursor: 'pointer',
    backgroundColor: '#4d4d4d',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#262626'
    }
  },
  errorAlert: {
    marginTop: '16px',
    borderRadius: 0,
    borderLeft: '4px solid #dc0000'
  }
};

// Define operators options
const operators = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'starts', label: 'Starts with' },
  { value: 'ends', label: 'Ends with' },
  { value: 'empty', label: 'Is empty' }
];

// Define fields options
const fields = [
  { value: 'Brand', label: 'Brand' },
  { value: 'Model', label: 'Model' },
  { value: 'BodyStyle', label: 'Body Style' },
  { value: 'Segment', label: 'Segment' },
  { value: 'PowerTrain', label: 'Power Train' }
];

interface CurrentFilter {
  field: string;
  operator: string;
  value: string;
}

interface FilterPanelProps {
  currentFilter: CurrentFilter;
  setCurrentFilter: React.Dispatch<React.SetStateAction<CurrentFilter>>;
  appliedFilters: FilterItem[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onApplyFilter: () => void;
  onRemoveFilter: (id: string) => void;
  onClearAllFilters: () => void;
  error: string | null;
}

const FilterPanelComponent: React.FC<FilterPanelProps> = ({
  currentFilter,
  setCurrentFilter,
  appliedFilters,
  searchValue,
  onSearchChange,
  onApplyFilter,
  onRemoveFilter,
  onClearAllFilters,
  error
}) => {
  // Check if apply button should be disabled
  const isApplyDisabled = () => {
    // If no field is selected, disable button
    if (!currentFilter.field) return true;

    // If operator is selected and it's not "empty", require a value
    if (currentFilter.operator &&
      currentFilter.operator !== 'empty' &&
      !currentFilter.value) {
      return true;
    }

    // Otherwise, enable if we have both field and operator
    return !currentFilter.operator;
  };

  // Get user-friendly label for filter field
  const getFilterFieldLabel = (fieldValue: string) => {
    const field = fields.find(f => f.value === fieldValue);
    return field ? field.label : fieldValue;
  };

  // Get user-friendly label for operator
  const getOperatorLabel = (operatorValue: string) => {
    const operator = operators.find(o => o.value === operatorValue);
    return operator ? operator.label : operatorValue;
  };

  return (
    <Card sx={styles.filterPaper}>
      <CardContent>
        <Box sx={styles.filterHeader}>
          <FilterAltIcon sx={styles.filterIcon} />
          <Typography variant="h6" sx={styles.filterTitle}>
            Search & Filter
          </Typography>
        </Box>

        {/* Global Search */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search across all fields"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={styles.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={styles.searchIcon} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Filter Controls */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth sx={styles.select}>
              <InputLabel id="filter-field-label">Field</InputLabel>
              <Select
                labelId="filter-field-label"
                value={currentFilter.field}
                label="Field"
                onChange={(e) => setCurrentFilter(prev => ({ ...prev, field: e.target.value }))}
              >
                <MenuItem value=""><em>Select a field</em></MenuItem>
                {fields.map(field => (
                  <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={styles.select}>
              <InputLabel id="filter-operator-label">Operator</InputLabel>
              <Select
                labelId="filter-operator-label"
                value={currentFilter.operator}
                label="Operator"
                onChange={(e) => setCurrentFilter(prev => ({ ...prev, operator: e.target.value }))}
                disabled={!currentFilter.field}
              >
                <MenuItem value=""><em>Select an operator</em></MenuItem>
                {operators.map(op => (
                  <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Value"
              value={currentFilter.value}
              onChange={(e) => setCurrentFilter(prev => ({ ...prev, value: e.target.value }))}
              disabled={!currentFilter.field || !currentFilter.operator || currentFilter.operator === 'empty'}
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={onApplyFilter}
              disabled={isApplyDisabled()}
              sx={{ ...styles.applyButton, height: '56px' }}
            >
              Apply Filter
            </Button>
          </Grid>
        </Grid>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={styles.errorAlert}>
            {error}
          </Alert>
        )}

        {/* Applied Filters */}
        {appliedFilters.length > 0 && (
          <Box sx={styles.filtersContainer}>
            <Typography variant="subtitle2" sx={styles.filtersTitle}>
              Applied Filters
            </Typography>
            <Stack direction="row" flexWrap="wrap">
              {appliedFilters.map((filter) => (
                <Chip
                  key={filter.id}
                  label={`${getFilterFieldLabel(filter.filter)} ${getOperatorLabel(filter.operator)} ${filter.operator === 'empty' ? '' : filter.value}`}
                  onDelete={() => onRemoveFilter(filter.id)}
                  sx={styles.filterChip}
                />
              ))}
              <Chip
                icon={<ClearAllIcon />}
                label="Clear All"
                onClick={onClearAllFilters}
                sx={styles.clearChip}
              />
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const FilterPanel = memo(FilterPanelComponent);
