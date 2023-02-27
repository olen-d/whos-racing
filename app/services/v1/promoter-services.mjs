const createPromoter = async (db, ObjectId, newPromoterInfo) => {
  try {
    const { creatorId: creatorIdValue, ownerId: ownerIdValue } = newPromoterInfo
    newPromoterInfo.creatorId = ObjectId(creatorIdValue)
    newPromoterInfo.ownerId = ObjectId(ownerIdValue)

    const result = await db.collection('promoters').insertOne(newPromoterInfo)

    return result
  } catch (error) {
    throw new Error(`Promoter Services Create Promoter ${error}`)
  }
}

const deletePromoter = async (db, ObjectId, promoterId) => {
  try {
    const filter = { _id: ObjectId(promoterId) }
    const result = await db.collection('promoters').findOneAndDelete(filter)

    return result
  } catch (error) {
    throw new Error(`Promoter Services Delete Promoter ${error}`)
  }
}

const readAllPromoters = async db => {
  try {
    const cursor = db.collection('promoters').find().project({ _id: 1, promoterName: 1, promoterUrl: 1, creatorId: 1, ownerId: 1, createdAt: 1, updatedAt: 1 })
    const data = await cursor.toArray()
  
    return data
  } catch (error) {
    throw new Error(`Promoter Services Read All Promoters ${error}`)
  }
}

const readPromoterById = async (db, ObjectId, _id) => {
  try {
    const cursor = await db.collection('promoters').find({ _id: ObjectId(_id) }).project({ _id: 1, promoterName: 1, promoterUrl: 1, creatorId: 1, ownerId: 1, createdAt: 1, updatedAt: 1 })
    const data = await cursor.toArray()

    return data
  } catch (error) {
    throw new Error(`Promoter Services Read Promoter By Id ${error}`)
  }
}

const readPromotersByOwnerId = async (db, ObjectId, ownerId) => {
  try {
    const cursor = await db.collection('promoters').find({ ownerId: ObjectId(ownerId) }).project({ _id: 1, promoterName: 1, promoterUrl: 1, creatorId: 1, ownerId: 1, createdAt: 1, updatedAt: 1 })
    const data = await cursor.toArray()

    return data
  } catch (error) {
    throw new Error(`Promoter Services Read Promoters By Owner Id ${error}`)
  }
}

export {
  createPromoter,
  deletePromoter,
  readAllPromoters,
  readPromoterById,
  readPromotersByOwnerId
}
