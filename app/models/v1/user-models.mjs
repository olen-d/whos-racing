import { hashPassword } from '../../services/v1/bcrypt-services.mjs'

import { createUser, readAllUsers, readUserByUsername, readUserRoleById } from '../../services/v1/user-services.mjs'
import { processValidations } from '../../services/v1/process-validation-services.mjs'
import { validatePassword, validateRole, validateUsername} from '../../services/v1/validate-user-services.mjs'
import { validateEmailAddress, validateFirstName, validateLastName } from '../../services/v1/validate-services.mjs'

const getAllUsers = async (db) => {
  const data = await readAllUsers(db)
  return { status: 'ok', data }
}

const getUserByUsername = async (db, username) => {
  const data = await readUserByUsername(db, username)
  return { status: 'ok', data }
}

const getUserRoleById = async (db, ObjectId, userId) => {
  const data = await readUserRoleById(db, ObjectId, userId)
  return { status: 'ok', data }
}

const newUser = async (db, userInfo) => {
  const {
    emailAddress,
    firstName,
    lastName,
    plaintextPassword,
    role,
    username: usernameRaw,
    createdBy
  } = userInfo

  const username = usernameRaw.toLowerCase()

  const isValidEmailAddress = validateEmailAddress(emailAddress)
  const isValidFirstName = validateFirstName(firstName)
  const isValidLastName = validateLastName(lastName)
  const isValidPassword = validatePassword(plaintextPassword)
  const isValidRole = validateRole(role)
  const isValidUsername = validateUsername(db, username)

  const validations = await Promise.allSettled([isValidEmailAddress, isValidFirstName, isValidLastName, isValidPassword, isValidRole, isValidUsername])
  const fields = ['emailAddress', 'firstName', 'lastName', 'plaintextPassword', 'role', 'username'] // These need to be in the same order as Promise.allSettled above

  const validationResults = await processValidations(fields, validations)
  const foundValidationError = validationResults.findIndex((field) => {
    if (field.isValid === false) { return true }
  })

  if (foundValidationError === -1) {
    const passwordHash = await hashPassword(plaintextPassword)

    if (passwordHash) {
      const userInfoValidated = {
        emailAddress,
        firstName,
        lastName,
        passwordHash,
        role,
        username,
        createdBy
      }

      const data = await createUser(db, userInfoValidated)
      return { status: 'ok', data }
    }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { getAllUsers, getUserByUsername, getUserRoleById, newUser }
