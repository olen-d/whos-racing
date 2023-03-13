import * as fs from 'fs'

const createRefreshToken = async (db, newRefreshToken) => {
  try {
    const result = await db.collection('refreshTokens').insertOne(newRefreshToken)
    return result
  } catch (error) {
    throw new Error(`Auth Services Create Refresh Token ${error}`)
  }
}

const deleteRefreshToken = async (db, refreshToken) => {
  try {
    const filter = { refreshToken }
    const result = await db.collection('refreshTokens').findOneAndDelete(filter)

    return result
  } catch (error) {
    throw new Error(`Auth Services Delete Refresh Token ${error}`)
  }
}

const readPublicKeyTokenBearer = publicKeyFile => {
  try {
    const publicKey = fs.readFileSync(publicKeyFile)
    return publicKey
  } catch (error) {
    throw new Error(`Auth Services Read Public Key Token Bearer ${error}`)
  }
}

const readPublicKeyTokenRefresh = publicKeyFile => {
  try {
    const publicKey = fs.readFileSync(publicKeyFile)
    return publicKey
  } catch (error) {
    throw new Error(`Auth Services Read Public Key Token Refresh ${error}`)
  }
}

const readRefreshToken = async (db, ObjectId, userId, refreshToken, ipAddress) => {
  try {
    const result = await db.collection('refreshTokens').findOne({ userId: ObjectId(userId), refreshToken, ipAddress})
    return result
  } catch (error) {
    throw new Error(`Auth Services Read Refresh Token ${error}`)
  }
}

export {
  createRefreshToken,
  deleteRefreshToken,
  readPublicKeyTokenBearer, 
  readPublicKeyTokenRefresh,
  readRefreshToken
}
