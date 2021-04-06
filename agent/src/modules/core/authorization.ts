import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import jwtDecode from 'jwt-decode';
import { Config } from "./config";
import { UserIdentity } from "./context";

export type Jwk = jwkToPem.JWK & { kid: string };

const JWKS_PATH = `./jwks.json`;

export async function validateAccess(rawToken: string, config: Config) {
  let success = false;
  const nowSeconds = Date.now() / 1000;

  try {
    const identity = {
      // tslint:disable-next-line: no-unnecessary-type-assertion
      ...(jwtDecode(rawToken, { header: true }) as UserIdentity),
      // tslint:disable-next-line: no-unnecessary-type-assertion
      ...(jwtDecode(rawToken, { header: false }) as UserIdentity),
    };

    if (identity.tid !== config.AUTH_TENANT_ID) {
      throw new Error('TenantID mismatch!')
    } else if (identity.aud !== config.AUTH_APP_ID) {
      throw new Error('App ID mismatch!')
    } else if (identity.exp <= nowSeconds) {
      throw new Error('Token has expired!')
    }

    const { keys: jwks } = eval(`require`)(`${JWKS_PATH}`) as { keys: Jwk[] };
    const jwk = jwks.find(p => p.kid === identity.kid);
    const jwkPem = jwkToPem(jwk as unknown as jwkToPem.JWK);

    if (!await verify(rawToken, jwkPem)) {
      throw new Error('Token cannot be verified');
    }

    success = true;
  }
  catch (e) {
    console.log(e.toString());
  }

  return success;
}

async function verify(token: string, jwkPem: string) {
  const decodedToken = await new Promise((accept, reject) =>
    jwt.verify(
      token,
      jwkPem,
      { algorithms: ['RS256'] },
      (err: unknown, decoded: unknown) => {
        if (err !== undefined && err !== null) {
          reject(err);
        }
        else {
          accept(decoded ?? null);
        }
      }));

  return decodedToken !== null;
}