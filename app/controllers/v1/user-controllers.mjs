import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { issueBearerToken, issueRefreshToken } from '../../services/v1/jsonwebtoken-services.mjs'
import { getAllUsers, newUser } from '../../models/v1/user-models.mjs'

async function addUser (req, reply) {
  const { mongo: { db } } = this // ObjectId is also available

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Only admin or superadmin can create a new user
  const canCreateUser = role === 'admin' || role === 'superadmin'
  const canCreateAdmin = role === 'superadmin'

  if (canCreateUser) {
    const trimmed = trimAll(body)
    const userInfo = sanitizeAll(trimmed)
    const { role: newUserRole } = userInfo

    userInfo.createdBy = sub

    if (newUserRole !== 'admin' && newUserRole !== 'superadmin') {
      const result = await newUser(db, userInfo)
      return result
    }
    if (canCreateAdmin && newUserRole === 'admin') {
      const result = await newUser(db, userInfo)
      return result
    } else {
      throw new Error('current role cannot create an administrator')
    }
  } else {
    throw new Error('current role cannot create a user')
  }
}

async function addUserGuest (req, reply) {
  const {
    config: { 
      JWT_ALGORITHM: algorithm,
      JWT_AUDIENCE: audience,
      CLIENT_ID: clientId,
      JWT_ISSUER: issuer,
      JWT_PRIVATE_KEY_PEM_FILE: privateKeyFile,
      RT_AUDIENCE: refreshtokenAudience,
      RT_PRIVATE_KEY_PEM_FILE: refreshTokenPrivateKeyFile
    }, 
    mongo: { db }
  } = this

  // const { ip: clientIp } = req

  try {
    const { body } = req

    const expiresIn = '1h'
    const refreshTokenExpiresIn = '5d'
    const role = 'user'

    const trimmed = trimAll(body)
    const userInfo = sanitizeAll(trimmed)

    userInfo.role = role
    userInfo.createdBy = 'system'
  
    const result = await newUser(db, userInfo)
    const { status } = result

    if (status === 'error') {
      return result
    } else if (status === 'ok') {
      const { data: { insertedId: userIdHex }, } = result

      if (userIdHex) {
        const userId = userIdHex.toString()
  
        const accessToken = await issueBearerToken(algorithm, audience, expiresIn, issuer, privateKeyFile, role, userId)
        const refreshToken = await issueRefreshToken(algorithm, refreshtokenAudience, clientId, refreshTokenExpiresIn, issuer, refreshTokenPrivateKeyFile, userId)
        return {
          status: 'ok',
          data: {
            tokenType: 'bearer',
            accessToken,
            refreshToken
          }
        }
      }
    }
  } catch (error) {
    throw new Error(`User Controllers Add User Guest ${error}`)
  }
}

async function readAllUsers (req, reply) {
  const { mongo: { db } } = this

  const result = await getAllUsers(db)
  return result
}

export { addUser, addUserGuest, readAllUsers }
