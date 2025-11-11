import request from '@/utils/request'

// 查询用户管理列表
export function listUser(query) {
  return request({
    url: '/app/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户管理详细
export function getUser(id) {
  return request({
    url: '/app/user/' + id,
    method: 'get'
  })
}
// 通过wtid获取用户详情
export function getUserByWtId(wtId) {
  return request({
    url: '/app/user/getByWtId/' + wtId,
    method: 'get'
  })
}
// 新增用户管理
export function addUser(data) {
  return request({
    url: '/app/user',
    method: 'post',
    data: data
  })
}

// 修改用户管理
export function updateUser(data) {
  return request({
    url: '/app/user',
    method: 'put',
    data: data
  })
}

// 删除用户管理
export function delUser(id) {
  return request({
    url: '/app/user/' + id,
    method: 'delete'
  })
}
// 添加用户分组
export function addUserGroup(data) {
  return request({
    url: '/app/user/updGroup',
    method: 'post',
    data: data
  })
}
// 获取后台用户列表
export function getUserListAll() {
  return request({
    url: '/system/user/listAll',
    method: 'get'
  })
}