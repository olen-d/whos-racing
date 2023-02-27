import * as raceControllers from '../../controllers/v1/race-controllers.mjs'
import * as schemas from '../../schemas/v1/race-schemas.mjs'

const routes = (app, opts, done) => {
  app.delete('/', { schema: schemas.discardRaceSchema, preHandler: app.auth([app.verifyJWT]) }, raceControllers.discardRace)

  app.get('/', { schema: schemas.readAllRacesSchema }, raceControllers.readAllRaces)
  app.get('/id/:id', raceControllers.readRaceById)
  app.get('/going/:raceId', { schema: schemas.readRaceGoingByRaceIdSchema, preHandler: app.auth([app.verifyJWT]) }, raceControllers.readRaceGoingByRaceId)
  app.get('/interested/:raceId', { schema: schemas.readRaceInterestedByRaceIdSchema, preHandler: app.auth([app.verifyJWT]) }, raceControllers.readRaceInterestedByRaceId)
  app.get('/owner/id/:id', raceControllers.readRacesByOwnerId)
  app.get('/participants', { schema: schemas.readAllRacesParticipantsSchema, preHandler: app.auth([app.verifyJWT]) }, raceControllers.readAllRacesParticipants)
  app.get('/upcoming', { schema: schemas.readRacesUpcomingSchema }, raceControllers.readRacesUpcoming)
  app.get('/upcoming/participants', { schema: schemas.readRacesUpcomingParticipantsSchema, preHandler: app.auth[app.verifyJWT] }, raceControllers.readRacesUpcomingParticipants)

  app.patch('/going', { schema: schemas.changeGoingSchema, preHandler: app.auth([app.verifyJWT]) }, raceControllers.changeGoing)
  app.patch('/interested', { schema: schemas.changeInterestedSchema, preHandler: app.auth([app.verifyJWT]) }, raceControllers.changeInterested)

  app.post('/', { schema: schemas.addRaceSchema, preHandler: app.auth([app.verifyJWT]) }, raceControllers.addRace)

  done()
}

export { routes }
