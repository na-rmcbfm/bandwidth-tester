import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import type { TestResult } from '../types';

interface HistoryTableProps {
  results: TestResult[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ results }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (results.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No test results yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Run a speed test to see your results here
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date & Time</TableCell>
            <TableCell align="right">Download (Mbps)</TableCell>
            <TableCell align="right">Upload (Mbps)</TableCell>
            <TableCell align="right">Latency (ms)</TableCell>
            <TableCell align="right">Jitter (ms)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow
              key={result.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {formatDate(result.timestamp)}
              </TableCell>
              <TableCell align="right">{result.download_speed.toFixed(1)}</TableCell>
              <TableCell align="right">{result.upload_speed.toFixed(1)}</TableCell>
              <TableCell align="right">{result.latency.toFixed(1)}</TableCell>
              <TableCell align="right">{result.jitter.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
