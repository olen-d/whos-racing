const createGoing = async (db, ObjectId, newGoingInfo) => {
  try {
    const { raceId: raceIdValue, userId: userIdValue } = newGoingInfo
    const raceId = ObjectId(raceIdValue)
    const userId = ObjectId(userIdValue)

    const result = await db.collection('races').updateOne({ _id: raceId }, { $addToSet: { going: userId }})
    return result
  } catch (error) {
    throw new Error(`Race Services Create Going ${error}`)
  }
}

const createInterested = async (db, ObjectId, newInterestedInfo) => {
  try {
    const { raceId: raceIdValue, userId: userIdValue } = newInterestedInfo
    const raceId = ObjectId(raceIdValue)
    const userId = ObjectId(userIdValue)

    const result = await db.collection('races').updateOne({ _id: raceId }, { $addToSet: { interested: userId }})
    return result
  } catch (error) {
    throw new Error(`Race Services Create Interested ${error}`)
  }
}

const createRace = async (db, ObjectId, newRaceInfo) => {
  try {
    const { creatorId: creatorIdValue, ownerId: ownerIdValue, promoterId: promoterIdValue } = newRaceInfo
    newRaceInfo.creatorId = ObjectId(creatorIdValue)
    newRaceInfo.ownerId = ObjectId(ownerIdValue)
    newRaceInfo.promoterId = ObjectId(promoterIdValue)
    const result = await db.collection('races').insertOne(newRaceInfo)
    return result
  } catch (error) {
    throw new Error(`Race Services Create Race ${error}`)
  }
}

const deleteGoing = async (db, ObjectId, newGoingInfo) => {
  try {
    const { raceId: raceIdValue, userId: userIdValue } = newGoingInfo
    const raceId = ObjectId(raceIdValue)
    const userId = ObjectId(userIdValue)

    const result = await db.collection('races').updateOne({ _id: raceId }, { $pull: { going: userId }})
    return result
  } catch (error) {
    throw new Error(`Race Services Delete Going ${error}`)
  }
}

const deleteInterested = async (db, ObjectId, newInterestedInfo) => {
  try {
    const { raceId: raceIdValue, userId: userIdValue } = newInterestedInfo
    const raceId = ObjectId(raceIdValue)
    const userId = ObjectId(userIdValue)

    const result = await db.collection('races').updateOne({ _id: raceId }, { $pull: { interested: userId }})
    return result
  } catch (error) {
    throw new Error(`Race Services Delete Interested ${error}`)
  }
}

const deleteRace = async (db, ObjectId, raceId) => {
  try {
    const filter = { _id: ObjectId(raceId) }
    const result = await db.collection('races').findOneAndDelete(filter)

    return result
  } catch (error) {
    throw new Error(`Race Services Delete Race ${error}`)
  }
}

const readAllRaces = async db => {
  try {
    const cursor = db.collection('races').aggregate([
      {
        $lookup:
          {
            from: "promoters",
            localField: "promoterId",
            foreignField: "_id",
            as: "promoterNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            raceName: 1,
            raceUrl: 1,
            date: 1,
            city: 1,
            state: 1,
            creatorId: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            promoterNames:
              {
                _id: 1,
                promoterName: 1,
                promoterUrl: 1
              }
          }
      }
    ]).sort({
      date: 1
    })
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Race Services Read All Races Participants ${error}`)
  }
}

const readAllRacesParticipants = async db => {
  try {
    const cursor = db.collection('races').aggregate([
      {
        $lookup:
          {
            from: "users",
            localField: "interested",
            foreignField: "_id",
            as: "interestedNames"
          }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "going",
            foreignField: "_id",
            as: "goingNames"
          }
      },
      {
        $lookup:
          {
            from: "promoters",
            localField: "promoterId",
            foreignField: "_id",
            as: "promoterNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            raceName: 1,
            raceUrl: 1,
            date: 1,
            city: 1,
            state: 1,
            creatorId: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            interestedNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            goingNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            promoterNames:
              {
                _id: 1,
                promoterName: 1,
                promoterUrl: 1
              }
          }
      }
    ]).sort({
      date: 1
    })
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Race Services Read All Races Participants ${error}`)
  }
}

const readRaceById = async (db, ObjectId, _id) => {
  try {
    const cursor = db.collection('races').aggregate([
      {
        $match:
          {
            _id: ObjectId(_id)
          }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "interested",
            foreignField: "_id",
            as: "interestedNames"
          }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "going",
            foreignField: "_id",
            as: "goingNames"
          }
      },
      {
        $lookup:
          {
            from: "promoters",
            localField: "promoterId",
            foreignField: "_id",
            as: "promoterNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            raceName: 1,
            raceUrl: 1,
            date: 1,
            city: 1,
            state: 1,
            creatorId: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            interestedNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            goingNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            promoterNames:
              {
                _id: 1,
                promoterName: 1,
                promoterUrl: 1
              }
          }
      }
    ])
    const data = await cursor.toArray()

    return data
  } catch (error) {
    throw new Error(`Race Services Read Race By Id ${error}`)
  }
}

const readRaceGoingByRaceId = async (db, ObjectId, raceIdValue) => {
  try {
    const raceId = ObjectId(raceIdValue)
    const cursor = db.collection('races').aggregate([
      {
        $match: { _id: raceId}
      },
      {
        $lookup:
          {
            from: "users",
            localField: "going",
            foreignField: "_id",
            as: "goingNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            goingNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              }
          }
      }
    ])
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Race Services Read Race Going By Race Id ${error}`)
  }
}

const readRaceInterestedByRaceId = async (db, ObjectId, raceIdValue) => {
  try {
    const raceId = ObjectId(raceIdValue)
    const cursor = db.collection('races').aggregate([
      {
        $match: { _id: raceId}
      },
      {
        $lookup:
          {
            from: "users",
            localField: "interested",
            foreignField: "_id",
            as: "interestedNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            interestedNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              }
          }
      }
    ])
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Race Services Read Race Interested By Race Id ${error}`)
  }
}

const readRacesByOwnerId = async (db, ObjectId, ownerId) => {
  try {
    const cursor = db.collection('races').aggregate([
      {
        $match:
          {
            ownerId: ObjectId(ownerId)
          }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "interested",
            foreignField: "_id",
            as: "interestedNames"
          }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "going",
            foreignField: "_id",
            as: "goingNames"
          }
      },
      {
        $lookup:
          {
            from: "promoters",
            localField: "promoterId",
            foreignField: "_id",
            as: "promoterNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            raceName: 1,
            raceUrl: 1,
            date: 1,
            city: 1,
            state: 1,
            creatorId: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            interestedNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            goingNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            promoterNames:
              {
                _id: 1,
                promoterName: 1,
                promoterUrl: 1
              }
          }
      }
    ])
    const data = await cursor.toArray()

    return data
  } catch (error) {
    throw new Error(`Race Services Read Races By Owner Id ${error}`)
  }
}

const readRacesUpcoming = async db => {
  try {
    const cursor = db.collection('races').aggregate([
      {
        $match:
          {
            date: { 
              $gte: new Date()
            }
          }
      },
      {
        $lookup:
          {
            from: "promoters",
            localField: "promoterId",
            foreignField: "_id",
            as: "promoterNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            raceName: 1,
            raceUrl: 1,
            date: 1,
            city: 1,
            state: 1,
            creatorId: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            promoterNames:
              {
                _id: 1,
                promoterName: 1,
                promoterUrl: 1
              }
          }
      }
    ]).sort({
      date: 1
    })
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Race Services Read All Races Participants ${error}`)
  }
}

const readRacesUpcomingParticipants = async db => {
  try {
    const cursor = db.collection('races').aggregate([
      {
        $match:
          {
            date: { 
              $gte: new Date()
            }
          }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "interested",
            foreignField: "_id",
            as: "interestedNames"
          }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "going",
            foreignField: "_id",
            as: "goingNames"
          }
      },
      {
        $lookup:
          {
            from: "promoters",
            localField: "promoterId",
            foreignField: "_id",
            as: "promoterNames"
          }
      },
      {
        $project:
          {
            _id: 1,
            raceName: 1,
            raceUrl: 1,
            date: 1,
            city: 1,
            state: 1,
            creatorId: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            interestedNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            goingNames: 
              {
                _id: 1,
                firstName: 1,
                lastName: 1
              },
            promoterNames:
              {
                _id: 1,
                promoterName: 1,
                promoterUrl: 1
              }
          }
      }
    ]).sort({
      date: 1
    })
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Race Services Read All Races Participants ${error}`)
  }
}

export {
  createGoing,
  createInterested,
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
}
