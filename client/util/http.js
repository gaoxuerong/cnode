import axios from 'axios'

const queryString = (url, json) => {
  const str = Object.keys(json).reduce((result, key) => {
    result += `${key}=${json[key]}&`
    return result
  }, '')
  return `${url}?${str.substr(0, str.length - 1)}`
}

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(queryString(`/api${url}`, params))
      .then(resp => {
        resolve(resp.data)
      })
      .catch(reject)
  })
}

export const post = (url, data) => {
  return new Promise((resolve, reject) => {
    axios.post(`https://cnodejs.org/api/v1${url}`, data)
      .then(resp => {
        resolve(resp.data)
      })
      .catch(reject)
  })
}
