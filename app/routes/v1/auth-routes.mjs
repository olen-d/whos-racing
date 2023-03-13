import * as authControllers from '../../controllers/v1/auth-controllers.mjs'
import * as schemas from '../../schemas/v1/auth-schemas.mjs'

const routes = (app, opts, done) => {
  app.get('/token/bearer/public-key', { schema: schemas.tokenPublicKeySchema }, authControllers.tokenBearerPublicKey)
  app.get('/token/refresh/public-key', { schema: schemas.tokenPublicKeySchema }, authControllers.tokenRefreshPublicKey)
  app.get('/token/refresh/clear-cookie', authControllers.tokenRefreshClearCookie)
  app.post('/token/grant-type/password', { schema: schemas.tokenGrantTypePasswordSchema }, authControllers.tokenGrantTypePassword)
  app.post('/token/grant-type/refresh-token', { schema: schemas.tokenGrantTypeRefreshTokenSchema }, authControllers.tokenGrantTypeRefreshToken)
  done()
}

export { routes }
