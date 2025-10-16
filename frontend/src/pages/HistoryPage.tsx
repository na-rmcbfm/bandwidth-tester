import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { HistoryTable } from '../components/HistoryTable';
import { SpeedChart } from '../components/SpeedChart';
import { getResults, handleApiError } from '../services/api';
import type { TestResult } from '../types';

export const HistoryPage: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getResults();
      setResults(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Test History
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View your past speed test results
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <SpeedChart results={results} />
          </Box>

          <Paper>
            <HistoryTable results={results} />
          </Paper>
        </>
      )}
    </Container>
  );
};
