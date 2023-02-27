import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import {
  getAllRaces,
  getAllRacesParticipants,
  getRaceById,
  getRaceGoingByRaceId,
  getRaceInterestedByRaceId,
  getRacesByOwnerId,
  getRacesUpcoming,
  getRacesUpcomingParticipants,
  newInterested,
  newGoing,
  newRace,
  removeGoing,
  removeInterested,
  removeRace
} from '../../models/v1/race-models.mjs'

async function addRace (req, reply) {
  const { mongo: { db, ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req

  const rolesAuthorized = ['user', 'admin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const raceInfo = sanitizeAll(trimmed)

    raceInfo.creatorId = sub
    raceInfo.ownerId = sub

    const result = await newRace(db, ObjectId, raceInfo)
    return result
  } else {
    throw new Error('current role cannot create a race')
  }
}

async function changeGoing (req, reply) {
  const { mongo: {db, ObjectId} } = this

  const { body, verifiedAuthToken: { role, sub}, } = req

  const rolesAuthorized = ['guest', 'user', 'admin', 'superadmin']
  const canChange = rolesAuthorized.indexOf(role) !== -1

  if (canChange) {
    const trimmed = trimAll(body)
    const goingInfoRaw = sanitizeAll(trimmed)

    const { action, ...goingInfo } = goingInfoRaw
    goingInfo.userId = sub

    if (action === 'create') {
      const result = await newGoing(db, ObjectId, goingInfo)
      return result
    } else if (action === 'delete') {
      const result = await removeGoing(db, ObjectId, goingInfo)
      return result
    }
  } else {
    throw new Error('current role cannot update going')
  }
}

async function changeInterested (req, reply) {
  const { mongo: {db, ObjectId} } = this

  const { body, verifiedAuthToken: { role, sub}, } = req

  const rolesAuthorized = ['guest', 'user', 'admin', 'superadmin']
  const canChange = rolesAuthorized.indexOf(role) !== -1

  if (canChange) {
    const trimmed = trimAll(body)
    const interestedInfoRaw = sanitizeAll(trimmed)

    const { action, ...interestedInfo } = interestedInfoRaw
    interestedInfo.userId = sub

    if (action === 'create') {
      const result = await newInterested(db, ObjectId, interestedInfo)
      return result
    } else if (action === 'delete') {
      const result = await removeInterested(db, ObjectId, interestedInfo)
      return result
    }
  } else {
    throw new Error('current role cannot update interested')
  }
}

async function discardRace (req, reply) {
  try {
    const { mongo: { db, ObjectId } } = this

    const { body, verifiedAuthToken: { role, sub }, } = req

    const trimmed = trimAll(body)
    const raceInfo = sanitizeAll(trimmed)

    const { id } = raceInfo

    let isAuthorizedUser = false
    if (role === 'user') {
      const response = await getRaceById(db, ObjectId, id)

      const { data: [{ ownerId }], } = response

      const ownerIdString = ownerId.toString()
      if (sub === ownerIdString) { isAuthorizedUser = true }
    }

    const rolesAuthorized = ['admin', 'superadmin']
    const canDelete = rolesAuthorized.indexOf(role) !== -1 || isAuthorizedUser
  
    if (canDelete) {
      const result = await removeRace(db, ObjectId, id)
      return result
    } else {
      throw new Error('current role cannot delete a race')
    }
  } catch (error) {
    throw new Error(`Race Controllers Discard Race ${error}`)
  }
}

async function readAllRaces (req, reply) {
  try {
    const { mongo: { db } } = this
    const result = await getAllRaces(db)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read All Races ${error}`)
  }
}

async function readAllRacesParticipants (req, reply) {
  try {
    const { mongo: { db } } = this
    const result = await getAllRacesParticipants(db)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read All Races Participants ${error}`)
  }
}

async function readRaceById (req, reply) {
  try {
    const { mongo: { db, ObjectId } } = this
    const { params: { id }, } = req

    const result = await getRaceById(db, ObjectId, id)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read Race By Id ${error}`)
  }
}

async function readRaceGoingByRaceId (req, reply) {
  try {
    const { mongo: {db, ObjectId} } = this
    const { params: { raceId }, } = req
    const result = await getRaceGoingByRaceId(db, ObjectId, raceId)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read Races Going By Race Id ${error}`)
  }
}

async function readRaceInterestedByRaceId (req, reply) {
  try {
    const { mongo: {db, ObjectId} } = this
    const { params: { raceId }, } = req
    const result = await getRaceInterestedByRaceId(db, ObjectId, raceId)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read Races Interested By Race Id ${error}`)
  }
}

async function readRacesByOwnerId (req, reply) {
  try {
    const { mongo: { db, ObjectId } } = this
    const { params: { id }, } = req

    const result = await getRacesByOwnerId(db, ObjectId, id)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read Races By Owner Id ${error}`)
  }
}

async function readRacesUpcoming (req, reply) {
  try {
    const { mongo: { db } } = this
    const result = await getRacesUpcoming(db)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read Races Upcoming ${error}`)
  }
}

async function readRacesUpcomingParticipants (req, reply) {
  try {
    const { mongo: { db } } = this
    const result = await getRacesUpcomingParticipants(db)
    return result
  } catch (error) {
    throw new Error(`Race Controllers Read Races Upcoming Participants ${error}`)
  }
}

export {
  addRace,
  changeGoing,
  changeInterested,
  discardRace,
  readAllRaces,
  readAllRacesParticipants,
  readRaceById,
  readRaceGoingByRaceId,
  readRaceInterestedByRaceId,
  readRacesByOwnerId,
  readRacesUpcoming,
  readRacesUpcomingParticipants
}
