const validatePromoterName = promoterName => {
  return new Promise((resolve, reject) => {
    try {
      const isValid = typeof promoterName === 'string' && promoterName.length > 0
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

export { validatePromoterName }
