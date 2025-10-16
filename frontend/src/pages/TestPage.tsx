import { useState } from 'react';
import {
  Container,
  Button,
  Box,
  Typography,
  Alert,
  Snackbar,
  LinearProgress,
  Paper,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import { SpeedGauge } from '../components/SpeedGauge';
import { downloadTest, uploadTest, calculateJitter, saveResult, handleApiError } from '../services/api';
import type { SpeedTestState } from '../types';

export const TestPage: React.FC = () => {
  const [state, setState] = useState<SpeedTestState>({
    isRunning: false,
    currentStep: 'idle',
    downloadSpeed: 0,
    uploadSpeed: 0,
    latency: 0,
    jitter: 0,
    error: null,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const runTest = async () => {
    setState({
      isRunning: true,
      currentStep: 'ping',
      downloadSpeed: 0,
      uploadSpeed: 0,
      latency: 0,
      jitter: 0,
      error: null,
    });

    try {
      // Step 1: Ping test
      setState((prev) => ({ ...prev, currentStep: 'ping' }));
      const { latency, jitter } = await calculateJitter(10);
      setState((prev) => ({ ...prev, latency, jitter }));

      // Step 2: Download test
      setState((prev) => ({ ...prev, currentStep: 'download' }));
      const downloadSpeed = await downloadTest(5);
      setState((prev) => ({ ...prev, downloadSpeed }));

      // Step 3: Upload test
      setState((prev) => ({ ...prev, currentStep: 'upload' }));
      const uploadSpeed = await uploadTest(3);
      setState((prev) => ({ ...prev, uploadSpeed }));

      // Step 4: Save results
      setState((prev) => ({ ...prev, currentStep: 'saving' }));
      await saveResult({
        download_speed: downloadSpeed,
        upload_speed: uploadSpeed,
        latency,
        jitter,
        user_agent: navigator.userAgent,
      });

      // Complete
      setState((prev) => ({ ...prev, currentStep: 'complete', isRunning: false }));
      setShowSuccess(true);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState((prev) => ({
        ...prev,
        isRunning: false,
        currentStep: 'idle',
        error: errorMessage,
      }));
    }
  };

  const getStepMessage = () => {
    switch (state.currentStep) {
      case 'ping':
        return 'Testing latency and jitter...';
      case 'download':
        return 'Testing download speed...';
      case 'upload':
        return 'Testing upload speed...';
      case 'saving':
        return 'Saving results...';
      case 'complete':
        return 'Test complete!';
      default:
        return 'Click "Start Test" to begin';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Internet Speed Test
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Test your internet bandwidth in seconds
        </Typography>
      </Box>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setState((prev) => ({ ...prev, error: null }))}>
          {state.error}
        </Alert>
      )}

      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SpeedIcon />}
            onClick={runTest}
            disabled={state.isRunning}
            sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
          >
            {state.isRunning ? 'Testing...' : 'Start Test'}
          </Button>
        </Box>

        {state.isRunning && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" align="center" gutterBottom>
              {getStepMessage()}
            </Typography>
            <LinearProgress />
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
            mt: 2,
          }}
        >
          <SpeedGauge
            label="Download"
            value={state.downloadSpeed}
            maxValue={100}
            color="primary"
          />
          <SpeedGauge
            label="Upload"
            value={state.uploadSpeed}
            maxValue={50}
            color="secondary"
          />
          <SpeedGauge
            label="Latency"
            value={state.latency}
            unit="ms"
            maxValue={200}
            color="warning"
          />
          <SpeedGauge
            label="Jitter"
            value={state.jitter}
            unit="ms"
            maxValue={50}
            color="error"
          />
        </Box>
      </Paper>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Test results saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};
