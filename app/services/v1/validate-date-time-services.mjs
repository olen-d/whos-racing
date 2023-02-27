const validateTimestamp = timestamp => {
  return new Promise((resolve, reject) => {
    try {
      const isValid = timestamp >= -8640000000000000 && timestamp <= 8640000000000000
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

export { validateTimestamp }
