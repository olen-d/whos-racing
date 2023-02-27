const validateRaceName = raceName => {
  return new Promise((resolve, reject) => {
    try {
      const isValid = typeof raceName === 'string' && raceName.length > 0
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

export { validateRaceName }
