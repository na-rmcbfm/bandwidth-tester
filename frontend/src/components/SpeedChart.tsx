import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';
import type { TestResult } from '../types';

interface SpeedChartProps {
  results: TestResult[];
}

export const SpeedChart: React.FC<SpeedChartProps> = ({ results }) => {
  const chartData = results
    .slice()
    .reverse()
    .map((result) => ({
      date: new Date(result.timestamp).toLocaleDateString(),
      time: new Date(result.timestamp).toLocaleTimeString(),
      download: parseFloat(result.download_speed.toFixed(1)),
      upload: parseFloat(result.upload_speed.toFixed(1)),
    }));

  if (chartData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No data to display
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Speed History
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'Speed (Mbps)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="download"
            stroke="#1976d2"
            name="Download"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="upload"
            stroke="#dc004e"
            name="Upload"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};
