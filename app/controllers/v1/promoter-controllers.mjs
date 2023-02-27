import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import {
  getAllPromoters,
  getPromoterById,
  getPromotersByOwnerId,
  newPromoter,
  removePromoter
} from '../../models/v1/promoter-models.mjs'

async function addPromoter (req, reply) {
  const { mongo: { db, ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req

  const rolesAuthorized = ['user', 'admin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const promoterInfo = sanitizeAll(trimmed)

    promoterInfo.creatorId = sub
    promoterInfo.ownerId = sub

    const result = await newPromoter(db, ObjectId, promoterInfo)
    return result
  } else {
    throw new Error('current role cannot create a promoter')
  }
}

async function discardPromoter (req, reply) {
  try {
    const { mongo: { db, ObjectId } } = this

    const { body, verifiedAuthToken: { role, sub }, } = req

    const trimmed = trimAll(body)
    const promoterInfo = sanitizeAll(trimmed)

    const { id } = promoterInfo

    let isAuthorizedUser = false
    if (role === 'user') {
      const response = await getPromoterById(db, ObjectId, id)

      const { data: [{ ownerId }], } = response

      const ownerIdString = ownerId.toString()
      if (sub === ownerIdString) { isAuthorizedUser = true }
    }

    const rolesAuthorized = ['admin', 'superadmin']
    const canDelete = rolesAuthorized.indexOf(role) !== -1 || isAuthorizedUser
  
    if (canDelete) {
      const result = await removePromoter(db, ObjectId, id)
      return result
    } else {
      throw new Error('current role cannot delete a promoter')
    }
  } catch (error) {
    throw new Error(`Promoter Controllers Discard Promoter ${error}`)
  }
}

async function readAllPromoters (req, reply) {
  try {
    const { mongo: { db } } = this
    const result = await getAllPromoters(db)
    return result
  } catch (error) {
    throw new Error(`Promoter Controllers Read All Promoters ${error}`)
  }
}

async function readPromoterById (req, reply) {
  try {
    const { mongo: { db, ObjectId } } = this
    const { params: { id }, } = req

    const result = await getPromoterById(db, ObjectId, id)
    return result
  } catch (error) {
    throw new Error(`Promoter Controllers Read Promoter By Id ${error}`)
  }
}

async function readPromotersByOwnerId (req, reply) {
  try {
    const { mongo: { db, ObjectId } } = this
    const { params: { id }, } = req

    const result = await getPromotersByOwnerId(db, ObjectId, id)
    return result
  } catch (error) {
    throw new Error(`Promoter Controllers Read Promoters By Owner Id ${error}`)
  }
}

export {
  addPromoter,
  discardPromoter,
  readAllPromoters,
  readPromoterById,
  readPromotersByOwnerId
}
