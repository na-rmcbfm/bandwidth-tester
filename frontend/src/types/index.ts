export interface TestResult {
  id: string;
  timestamp: string;
  download_speed: number;
  upload_speed: number;
  latency: number;
  jitter: number;
  ip_address?: string;
  user_agent?: string;
}

export interface TestResultCreate {
  download_speed: number;
  upload_speed: number;
  latency: number;
  jitter: number;
  ip_address?: string;
  user_agent?: string;
}

export interface SpeedTestState {
  isRunning: boolean;
  currentStep: 'idle' | 'ping' | 'download' | 'upload' | 'saving' | 'complete';
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
  error: string | null;
}
