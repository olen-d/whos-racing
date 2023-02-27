import { stateNames } from './geography-services.mjs'

const validateCity = city => {
  return new Promise((resolve, reject) => {
    try {
      const isValid = typeof city === 'string' && city.length > 0
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateState = state => {
  return new Promise((resolve, reject) => {
    try {
      const isValid = stateNames.indexOf(state) !== -1
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

export { validateCity, validateState }
