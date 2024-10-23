import { expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';
import { config } from '../config';

export default jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth0JwksUri,
  }) as jwks.GetVerificationKey,
  issuer: config.auth0Issuer,
  algorithms: ['RS256'],
});
