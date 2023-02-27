import * as userControllers from '../../controllers/v1/user-controllers.mjs'
import * as schemas from '../../schemas/v1/user-schemas.mjs'

const routes = (app, opts, done) => {
  app.get('/', { schema: schemas.readAllUsersSchema }, userControllers.readAllUsers)
  app.post('/', { schema: schemas.addUserSchema, preHandler: app.auth([app.verifyJWT]) }, userControllers.addUser)
  app.post('/guest', { schema: schemas.addUserGuestSchema }, userControllers.addUserGuest)
  done()
}

export { routes }
