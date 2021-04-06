import { Config } from "./config";

export type Context = {
  identity: UserIdentity;
  config: Config;
  handle: string;
};

export type UserIdentity = {
  kid: string;
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  aio: string;
  amr: string[];
  c_hash: string;
  family_name: string;
  given_name: string;
  ipaddr: string;
  name: string;
  nonce: string;
  oid: string;
  rh: string;
  sub: string;
  tid: string;
  unique_name: string;
  upn: string;
  uti: string;
  ver: string;
};
