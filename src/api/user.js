import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/info', // '/phd-sharing-front/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout', // '/phd-sharing-front/user/logout',
    method: 'post'
  })
}

export function fetchUserInfo(userId) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { userId }
  })
}

export function updateUserInfo(data) {
  return request({
    url: '/user/updateInfo',
    method: 'post',
    data
  })
}

export function updatePassword(password) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    params: { password }
  })
}

export function fetchList(username) {
  return request({
    url: '/user/list',
    method: 'get',
    params: { username }
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
