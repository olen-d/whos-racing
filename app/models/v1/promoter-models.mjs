import {
  createPromoter,
  deletePromoter,
  readAllPromoters,
  readPromoterById,
  readPromotersByOwnerId
} from '../../services/v1/promoter-services.mjs'
import { processValidations } from '../../services/v1/process-validation-services.mjs'
import { validateUrl } from '../../services/v1/validate-services.mjs'
import { validatePromoterName } from '../../services/v1/validate-promoter-services.mjs'

const getAllPromoters = async db => {
  try {
    const data = await readAllPromoters(db)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Promoter Models Get All Promoters ${error}`)
  }
}

const getPromoterById = async (db, ObjectId, promoterId) => {
  try {
    const data = await readPromoterById(db, ObjectId, promoterId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Promoter Models Get Promoter By Id ${error}`)
  }
}

const getPromotersByOwnerId = async (db, ObjectId, ownerId) => {
  try {
    const data = await readPromotersByOwnerId(db, ObjectId, ownerId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Promoter Models Get Promoters By Owner Id ${error}`)
  }
}

const newPromoter = async (db, ObjectId, promoterInfo) => {
  const { creatorId, ownerId, promoterName, promoterUrl } = promoterInfo

  const isValidPromoterName = validatePromoterName(promoterName)
  const isValidPromoterUrl = validateUrl(promoterUrl)

  const validations = await Promise.allSettled([isValidPromoterName, isValidPromoterUrl])
  const fields = ['promoterName', 'promoterUrl'] // These need to be in the same order as Promise.allSettled above

  const validationResults = await processValidations(fields, validations)
  const foundValidationError = validationResults.findIndex((field) => {
    if (field.isValid === false) { return true }
  })

  const createdAt = new Date()

  if (foundValidationError === -1) {
    const promoterInfoValidated = {
      promoterName,
      promoterUrl,
      creatorId,
      ownerId,
      createdAt,
      updatedAt: createdAt
    }

    const data = await createPromoter(db, ObjectId, promoterInfoValidated)
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

const removePromoter = async (db, ObjectId, promoterId) => {
  try {
    const data = await deletePromoter(db, ObjectId, promoterId)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Promoter Models Delete Promoters ${error}`)
  }
}

export {
  getAllPromoters,
  getPromoterById,
  getPromotersByOwnerId,
  newPromoter,
  removePromoter
}
