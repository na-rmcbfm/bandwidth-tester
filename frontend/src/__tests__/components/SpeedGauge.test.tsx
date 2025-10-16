import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpeedGauge } from '../../components/SpeedGauge';

describe('SpeedGauge', () => {
  it('renders with label and value', () => {
    render(<SpeedGauge label="Download" value={50.5} />);

    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('50.5')).toBeInTheDocument();
    expect(screen.getByText('Mbps')).toBeInTheDocument();
  });

  it('renders with custom unit', () => {
    render(<SpeedGauge label="Latency" value={25.3} unit="ms" />);

    expect(screen.getByText('Latency')).toBeInTheDocument();
    expect(screen.getByText('25.3')).toBeInTheDocument();
    expect(screen.getByText('ms')).toBeInTheDocument();
  });

  it('displays value with one decimal place', () => {
    render(<SpeedGauge label="Upload" value={12.789} />);

    expect(screen.getByText('12.8')).toBeInTheDocument();
  });

  it('handles zero value', () => {
    render(<SpeedGauge label="Download" value={0} />);

    expect(screen.getByText('0.0')).toBeInTheDocument();
  });
});
