import fetch from 'node-fetch';
import { AGENT_ENDPOINT, getToken } from '../modules/core';

type AgentResponse<T> = {
  success: boolean;
  errors: string[];
  data: T;
};

type AgentOpCreate = {
  key: string;
  port: number;
};

type AgentOpList = {
  name: string;
  state: AgentContainerState;
  uptime: string;
  image: string;
  port: number;
  memory: {
    usage: string;
    percentage: string;
  };
}[];

export enum AgentContainerState {
  Created = 'created',
  Running = 'running',
  Exited = 'exited',
}

const api = async <R>(payload: {}) => (await fetch(AGENT_ENDPOINT, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    Authorization: await getToken() ?? '',
  },
  body: JSON.stringify(payload),
})).json() as Promise<AgentResponse<R>>;

export async function list() {
  const result = await api<AgentOpList>({
    command: 'list',
    args: {
      '-a': null,
    },
  });

  return result;
}

export async function start(name: string) {
  const result = await api<AgentResponse<never>>({
    command: 'start',
    payload: {
      name,
    },
  });

  return result;
}

export async function stop(name: string) {
  const result = await api<AgentResponse<never>>({
    command: 'stop',
    payload: {
      name,
    },
  });

  return result;
}

export async function remove(name: string) {
  const result = await api<AgentResponse<never>>({
    command: 'remove',
    payload: {
      name,
    },
  });

  return result;
}

export async function create(name: string) {
  const result = await api<AgentOpCreate>({
    command: 'create',
    payload: {
      name,
    },
  });

  return result;
}
