import { authenticateUser, getRefreshToken } from '../../models/v1/auth-models.mjs'
import { getUserRoleById } from '../../models/v1/user-models.mjs'
import { createRefreshToken, readPublicKeyTokenBearer, readPublicKeyTokenRefresh } from '../../services/v1/auth-services.mjs'
import { issueBearerToken, issueRefreshToken, verifyToken } from '../../services/v1/jsonwebtoken-services.mjs'
import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'

const tokenGrantTypePassword = async function (req, reply) {
  const { ip: clientIp } = req
  const { config: { JWT_ALGORITHM: algorithm, JWT_AUDIENCE: audience, CLIENT_ID: clientId, JWT_ISSUER: issuer, JWT_PRIVATE_KEY_PEM_FILE: privateKeyFile, RT_AUDIENCE: refreshtokenAudience, RT_PRIVATE_KEY_PEM_FILE: refreshTokenPrivateKeyFile }, mongo: { db, ObjectId } } = this

  const { body } = req

  const trimmed = trimAll(body)
  const sanitized = sanitizeAll(trimmed)

  const { plaintextPassword, username } = sanitized

  const info = {
    plaintextPassword,
    username
  }

  const result = await authenticateUser(db, ObjectId, algorithm, audience, clientId, clientIp, info, issuer, privateKeyFile, refreshtokenAudience, refreshTokenPrivateKeyFile)
  const { status } = result

  if (status === 'ok') {
    const expiration = new Date()
    expiration.setDate(expiration.getDate() + 30)

    const options = {
      expires: expiration,
      httpOnly: true,
      path: '/'
    }

    reply.code(201).setCookie('foo', 'bar', options).send(result)
  } else if (status === 'error') {
    const { type } = result
    switch (type) {
      case 'database':
        reply.code(503).send(result)
        break
      case 'jsonwebtoken':
        reply.code(503).send(result)
        break
      case 'not found':
        reply.code(404).send(result)
        break
      case 'validation':
        reply.code(400).send(result)
        break
      default:
        reply.code(503).send(result)
    }
  }
}

const tokenGrantTypeRefreshToken = async function (req, reply) {
  console.log(`\n\nCookieRT\n${JSON.stringify(req.cookies, null, 5)}\n\n`)
  const cookieRefreshToken = req?.cookies?.refreshToken // In case users have cookies disabled
  const { body: { refreshToken: refreshTokenValue }, headers: { referer }, ip: clientIp } = req
  const refreshToken = refreshTokenValue === 'none' && cookieRefreshToken ? cookieRefreshToken : refreshTokenValue
  const { config: { JWT_ALGORITHM: algorithm, JWT_AUDIENCE: audience, JWT_ISSUER: issuer, JWT_PRIVATE_KEY_PEM_FILE: privateKeyFile, RT_AUDIENCE: refreshtokenAudience, RT_PRIVATE_KEY_PEM_FILE: refreshTokenPrivateKeyFile, RT_PUBLIC_KEY_PEM_FILE: refreshTokenPublicKeyFile }, mongo: { db, ObjectId } } = this
  const verifyTokenResult = await verifyToken(refreshToken, refreshTokenPublicKeyFile, algorithm, issuer)
  const { clientId, sub: userId } = verifyTokenResult
  const clientName = clientId.split("://")[1] // discard http(s)://
  const refererName = referer.split("://")[1].split("/")[0]; // discard http(s):// and anything after the top level domain

  if (clientName === refererName) {
    const result = await getRefreshToken(db, ObjectId, userId, refreshToken, clientIp)

    if (result !== null && result.data !== null) {
      const userData = await getUserRoleById(db, ObjectId, userId)
      const expiresIn = '1h'
      const refreshTokenExpiresIn = '30d'
      const { role } = userData

      const accessToken = await issueBearerToken(algorithm, audience, expiresIn, issuer, privateKeyFile, role, userId)
      const newRefreshToken = await issueRefreshToken(algorithm, refreshtokenAudience, clientId, refreshTokenExpiresIn, issuer, refreshTokenPrivateKeyFile, userId)
      
      if (newRefreshToken) {
        const newRefreshTokenObj = {
          userId: ObjectId(userId),
          refreshToken,
          ipAddress: clientIp
        }
        const data = await createRefreshToken(db, newRefreshTokenObj)
        if (!data.acknowledged) {
          return { status: 'error', type: 'database', message: 'unable to insert refresh token' }
        }
      } else {
        return { status: 'error', type: 'jsonwebtoken', message: 'unable to create refresh token' }
      }
      return { status: 'ok', data: { tokenType: 'bearer', accessToken, newRefreshToken } }
    } else {
      return { status: 'error', type: 'jsonwebtoken', message: 'refresh token not found, unable to create refresh token' }
    }
  } else {
    return { status: 'error', type: 'jsonwebtoken', message: 'client referrer mismatch, unable to create refresh token' }
  }
}

const tokenBearerPublicKey = async function (req, reply) {
  const { config: { JWT_PUBLIC_KEY_PEM_FILE: publicKeyFile } } = this
  const publicKey = readPublicKeyTokenBearer(publicKeyFile)

  if (publicKey) {
    reply.code(200).send({ status: 'ok', data: { publicKey } })
  }
}

const tokenRefreshPublicKey = async function (req, reply) {
  const { config: { RT_PUBLIC_KEY_PEM_FILE: publicKeyFile } } = this
  const publicKey = readPublicKeyTokenRefresh(publicKeyFile)

  if (publicKey) {
    reply.code(200).send({ status: 'ok', data: { publicKey } })
  }
}

export { tokenGrantTypePassword, tokenGrantTypeRefreshToken, tokenBearerPublicKey, tokenRefreshPublicKey }
