export type Lookup<R = string> = {
  [key: string]: R;
  [key: number]: R;
};
