import fetch from 'node-fetch';

type AgentResponse<T> = {
  errors: string[];
  data: T;
};

type AgentContainer = {
  name: string;
  state: AgentContainerState;
  uptime: string;
  image: string;
  port: number;
  memory: {
    usage: string;
    percentage: string;
  };
};

export enum AgentContainerState {
  Created = 'created',
  Running = 'running'
}

const AGENT_ENDPOINT = 'http://localhost:2020';

const api = async <R>(payload: {}) => (await fetch(AGENT_ENDPOINT, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify(payload),
})).json() as Promise<AgentResponse<R>>;

export async function list() {
  const result = await api<AgentContainer[]>({
    command: 'ps',
    args: {
      '-a': null,
    },
  });

  return result.data;
}
