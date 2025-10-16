import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HistoryTable } from '../../components/HistoryTable';
import type { TestResult } from '../../types';

describe('HistoryTable', () => {
  const mockResults: TestResult[] = [
    {
      id: '1',
      timestamp: '2025-01-15T10:00:00Z',
      download_speed: 100.5,
      upload_speed: 50.2,
      latency: 25.3,
      jitter: 5.1,
    },
    {
      id: '2',
      timestamp: '2025-01-15T11:00:00Z',
      download_speed: 95.8,
      upload_speed: 48.6,
      latency: 28.1,
      jitter: 6.2,
    },
  ];

  it('renders empty state when no results', () => {
    render(<HistoryTable results={[]} />);

    expect(screen.getByText('No test results yet')).toBeInTheDocument();
  });

  it('renders table with results', () => {
    render(<HistoryTable results={mockResults} />);

    expect(screen.getByText('Download (Mbps)')).toBeInTheDocument();
    expect(screen.getByText('Upload (Mbps)')).toBeInTheDocument();
    expect(screen.getByText('Latency (ms)')).toBeInTheDocument();
    expect(screen.getByText('Jitter (ms)')).toBeInTheDocument();
  });

  it('displays correct speed values', () => {
    render(<HistoryTable results={mockResults} />);

    expect(screen.getByText('100.5')).toBeInTheDocument();
    expect(screen.getByText('50.2')).toBeInTheDocument();
    expect(screen.getByText('95.8')).toBeInTheDocument();
    expect(screen.getByText('48.6')).toBeInTheDocument();
  });

  it('displays all results', () => {
    render(<HistoryTable results={mockResults} />);

    const rows = screen.getAllByRole('row');
    // +1 for header row
    expect(rows).toHaveLength(mockResults.length + 1);
  });
});
