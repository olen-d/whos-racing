import {
  createInterested,
  createGoing,
  createRace,
  deleteGoing,
  deleteInterested,
  deleteRace,
  readAllRaces,
  readAllRacesParticipants,
  readRaceById,
  readRaceGoingByRaceId,
  readRaceInterestedByRaceId,
  readRacesByOwnerId,
  readRacesUpcoming,
  readRacesUpcomingParticipants
} from '../../services/v1/race-services.mjs'
import { processValidations } from '../../services/v1/process-validation-services.mjs'
import { validateTimestamp } from '../../services/v1/validate-date-time-services.mjs'
import { validateCity, validateState } from '../../services/v1/validate-geography-services.mjs'
import { validateRaceName } from '../../services/v1/validate-race-services.mjs'
import { validateMongoId, validateUrl } from '../../services/v1/validate-services.mjs'

const getAllRaces = async db => {
  try {
    const data = await readAllRaces(db)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get All Races ${error}`)
  }
}

const getAllRacesParticipants = async db => {
  try {
    const data = await readAllRacesParticipants(db)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get All Races Participants ${error}`)
  }
}

const getRaceById = async (db, ObjectId, raceId) => {
  try {
    const data = await readRaceById(db, ObjectId, raceId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get Race By Id ${error}`)
  }
}

const getRaceGoingByRaceId = async (db, ObjectId, raceId) => {
  try {
    const data = await readRaceGoingByRaceId(db, ObjectId, raceId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get Race Going By Race Id ${error}`)
  }
}

const getRaceInterestedByRaceId = async (db, ObjectId, raceId) => {
  try {
    const data = await readRaceInterestedByRaceId(db, ObjectId, raceId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get Race Interested By Race Id ${error}`)
  }
}

const getRacesByOwnerId = async (db, ObjectId, ownerId) => {
  try {
    const data = await readRacesByOwnerId(db, ObjectId, ownerId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get Races By Owner Id ${error}`)
  }
}

const getRacesUpcoming = async db => {
  try {
    const data = await readRacesUpcoming(db)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get Races Upcoming ${error}`)
  }
}

const getRacesUpcomingParticipants = async db => {
  try {
    const data = await readRacesUpcomingParticipants(db)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Get Races Upcoming Participants ${error}`)
  }
}

const newGoing = async (db, ObjectId, goingInfo) => {
  try {
    const data = await createGoing(db, ObjectId, goingInfo)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models New Going ${error}`)
  }
}

const newInterested = async (db, ObjectId, interestedInfo) => {
  try {
    const data = await createInterested(db, ObjectId, interestedInfo)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models New Interested ${error}`)
  }
}

const newRace = async (db, ObjectId, raceInfo) => {
  try {
    const { city, date: timestamp, creatorId, ownerId, promoterId, raceName, raceUrl, state } = raceInfo
    const isValidCity = validateCity(city)
    const isValidDate = validateTimestamp(timestamp)
    const isValidPromoterId = validateMongoId(ObjectId, promoterId)
    const isValidRaceName = validateRaceName(raceName)
    const isValidState = validateState(state)
    const isValidUrl = validateUrl(raceUrl)

    const validations = await Promise.allSettled([isValidCity, isValidDate, isValidPromoterId, isValidRaceName, isValidState, isValidUrl])
    const fields = ['city', 'date', 'promoterId', 'raceName', 'state', 'raceUrl'] // These need to be in the same order as Promise.allSettled above

    const validationResults = await processValidations(fields, validations)
    const foundValidationError = validationResults.findIndex((field) => {
      if (field.isValid === false) { return true }
    })

    if (foundValidationError === -1) {
      const createdAt = new Date()
      const date = new Date(timestamp)

      const raceInfoValidated = {
        raceName,
        raceUrl,
        date,
        city,
        state,
        promoterId,
        creatorId,
        ownerId,
        createdAt,
        updatedAt: createdAt
      }

      const data = await createRace(db, ObjectId, raceInfoValidated)
      return { status: 'ok', data }
    } else {
      return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
    }
  } catch (error) {
    throw new Error(`Race Models New Race ${error}`)
  }
}

const removeGoing = async (db, ObjectId, goingInfo) => {
  try {
    const data = await deleteGoing(db, ObjectId, goingInfo)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Remove Going ${error}`)
  }
}

const removeInterested = async (db, ObjectId, interestedInfo) => {
  try {
    const data = await deleteInterested(db, ObjectId, interestedInfo)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Remove Interested ${error}`)
  }
}

const removeRace = async (db, ObjectId, raceId) => {
  try {
    const data = await deleteRace(db, ObjectId, raceId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Race Models Remove Race ${error}`)
  }
}

export {
  getAllRaces,
  getAllRacesParticipants,
  getRaceById,
  getRaceGoingByRaceId,
  getRaceInterestedByRaceId,
  getRacesByOwnerId,
  getRacesUpcoming,
  getRacesUpcomingParticipants,
  newGoing,
  newInterested,
  newRace,
  removeGoing,
  removeInterested,
  removeRace
}
