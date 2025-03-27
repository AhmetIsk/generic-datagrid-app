import React, { ReactNode } from 'react';
import { Typography, Box, Divider } from '@mui/material';

// Styles for the component
const styles = {
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '8px'
  },
  sectionIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bmw-blue)',
    color: 'var(--bmw-white)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    marginRight: '12px'
  },
  sectionTitle: {
    fontWeight: 500,
    color: 'var(--bmw-black)',
    fontSize: '1.25rem'
  },
  divider: {
    marginBottom: '24px',
    borderColor: 'var(--bmw-light-gray)'
  }
};

interface SectionHeaderProps {
  title: string;
  icon: ReactNode;
}

/**
 * A reusable section header with icon and title
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) => {
  return (
    <>
      <Box sx={styles.sectionHeader}>
        <Box sx={styles.sectionIcon}>{icon}</Box>
        <Typography variant="h6" sx={styles.sectionTitle}>
          {title}
        </Typography>
      </Box>
      <Divider sx={styles.divider} />
    </>
  );
};

export default SectionHeader;
