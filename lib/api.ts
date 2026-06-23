import type { Api } from '@/server';
import { hc } from 'hono/client';

export const api = hc<Api>(`${location.origin}/api`);
