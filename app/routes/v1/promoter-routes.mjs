import * as promoterControllers from '../../controllers/v1/promoter-controllers.mjs'
import * as schemas from '../../schemas/v1/promoter-schemas.mjs'

const routes = (app, opts, done) => {
  app.delete('/', { schema: schemas.discardPromoterSchema, preHandler: app.auth([app.verifyJWT]) }, promoterControllers.discardPromoter)

  app.get('/', { schema: schemas.readAllPromotersSchema }, promoterControllers.readAllPromoters)
  app.get('/id/:id', { schema: schemas.readPromoterByIdSchema }, promoterControllers.readPromoterById)
  app.get('/owner/id/:id', promoterControllers.readPromotersByOwnerId)

  app.post('/', { schema: schemas.addPromoterSchema, preHandler: app.auth([app.verifyJWT]) }, promoterControllers.addPromoter)

  done()
}

export { routes }
