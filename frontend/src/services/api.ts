import axios, { AxiosError } from 'axios';
import type { TestResult, TestResultCreate } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await api.get('/api/health');
  return response.data;
};

// Ping test
export const pingTest = async (): Promise<number> => {
  const start = performance.now();
  const response = await api.get('/api/test/ping');
  const end = performance.now();
  const clientLatency = end - start;
  return clientLatency;
};

// Download test
export const downloadTest = async (sizeMb: number = 5): Promise<number> => {
  const start = performance.now();
  const response = await api.post(`/api/test/download?size_mb=${sizeMb}`, null, {
    responseType: 'arraybuffer',
  });
  const end = performance.now();

  const durationSeconds = (end - start) / 1000;
  const bytes = response.data.byteLength;
  const megabits = (bytes * 8) / 1_000_000;
  const mbps = megabits / durationSeconds;

  return mbps;
};

// Upload test
export const uploadTest = async (sizeMb: number = 5): Promise<number> => {
  // Generate random data
  const bytes = sizeMb * 1024 * 1024;
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);

  const start = performance.now();
  await api.post('/api/test/upload', data, {
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });
  const end = performance.now();

  const durationSeconds = (end - start) / 1000;
  const megabits = (bytes * 8) / 1_000_000;
  const mbps = megabits / durationSeconds;

  return mbps;
};

// Calculate jitter from multiple ping tests
export const calculateJitter = async (samples: number = 10): Promise<{ latency: number; jitter: number }> => {
  const latencies: number[] = [];

  for (let i = 0; i < samples; i++) {
    const latency = await pingTest();
    latencies.push(latency);
    // Small delay between pings
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  // Calculate jitter as standard deviation
  const squaredDiffs = latencies.map(l => Math.pow(l - avgLatency, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
  const jitter = Math.sqrt(variance);

  return { latency: avgLatency, jitter };
};

// Save result
export const saveResult = async (result: TestResultCreate): Promise<TestResult> => {
  const response = await api.post<TestResult>('/api/results/', result);
  return response.data;
};

// Get all results
export const getResults = async (skip: number = 0, limit: number = 100): Promise<TestResult[]> => {
  const response = await api.get<TestResult[]>(`/api/results/?skip=${skip}&limit=${limit}`);
  return response.data;
};

// Get single result
export const getResult = async (id: string): Promise<TestResult> => {
  const response = await api.get<TestResult>(`/api/results/${id}`);
  return response.data;
};

// Delete result
export const deleteResult = async (id: string): Promise<void> => {
  await api.delete(`/api/results/${id}`);
};

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      return `Server error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`;
    } else if (axiosError.request) {
      return 'No response from server. Please check your connection.';
    }
  }
  return 'An unexpected error occurred';
};
