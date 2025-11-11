import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const BaseUrlKey = 'oss-server-url'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getBaseUrl() {
  return Cookies.get(BaseUrlKey)
}

export function setBaseUrl(baseUrl) {
  return Cookies.set(BaseUrlKey, baseUrl)
}

export function removeBaseUrl() {
  return Cookies.remove(BaseUrlKey)
}
