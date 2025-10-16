import { Box, Typography, CircularProgress } from '@mui/material';

interface SpeedGaugeProps {
  label: string;
  value: number;
  unit?: string;
  maxValue?: number;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
}

export const SpeedGauge: React.FC<SpeedGaugeProps> = ({
  label,
  value,
  unit = 'Mbps',
  maxValue = 100,
  color = 'primary',
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 2,
      }}
    >
      <Typography variant="subtitle1" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={120}
          thickness={4}
          color={color}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" component="div" fontWeight="bold">
            {value.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {unit}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
