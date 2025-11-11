import request from '@/utils/request'

// 查询群组管理列表
export function listGroup(query) {
  return request({
    url: '/app/group/list',
    method: 'get',
    params: query
  })
}
// 查询群组管理详细
export function getGroup(id) {
  return request({
    url: '/app/group/' + id,
    method: 'get'
  })
}
// 修改群详情
export function updateGroup(data) {
  return request({
    url: '/app/group/edit',
    method: 'post',
    data: data
  })
}
// 查询群成员管理列表
export function listMember(query,data) {
  return request({
    url: '/app/groupMember/list',
    method: 'post',
    params: query,
    data: data
  })
}
// 添加或取消管理员
export function setOrCancelManager(data) {
  return request({
    url: '/app/group/setOrCancelManager',
    method: 'post',
    data: data
  })
}
// 批量移除群成员
export function removeMember(data) {
  return request({
    url: '/app/groupMember/batchRemove',
    method: 'post',
    data: data
  })
}
// 获取禁言成员可选列表
export function getMutedList(data) {
  return request({
    url: '/app/group/position/mutedList',
    method: 'post',
    data: data
  })
}
// 获取管理员可选列表
export function getAdminList(data) {
  return request({
    url: '/app/group/position/managerList',
    method: 'post',
    data: data
  })
}
// 获取群黑名单可选列表
export function getBlackList(data) {
  return request({
    url: '/app/group/position/blackList',
    method: 'post',
    data: data
  })
}
// 新增 / 移除禁言用户
export function setOrCancelMuted(data) {
  return request({
    url: '/app/group/muted',
    method: 'post',
    data: data
  })
}
// 新增黑名单
export function addBlack(data) {
  return request({
    url: '/app/group/addBlack',
    method: 'post',
    data: data
  })
}
// 移除黑名单
export function removeBlack(data) {
  return request({
    url: '/app/group/removeBlack',
    method: 'post',
    data: data
  })
}
// 设置最大群人数
export function setGroupMemberCount(data) {
  return request({
    url: '/app/group/setGroupMemberCount',
    method: 'post',
    data: data
  })
}