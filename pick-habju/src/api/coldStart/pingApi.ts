import type { PingResponse } from './ping.types';
import kyInstance from '../ky-instance';

export const getPing = async (): Promise<PingResponse> => {
  return kyInstance.get('ping').json<PingResponse>();
};
