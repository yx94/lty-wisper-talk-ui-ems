import request from '@/utils/request'

// 查询封禁管理列表
export function listDisableRecords(query) {
  return request({
    url: '/app/disableRecords/list',
    method: 'get',
    params: query
  })
}

// 查询封禁管理详细
export function getDisableRecords(id) {
  return request({
    url: '/app/disableRecords/' + id,
    method: 'get'
  })
}

// 新增封禁管理
export function addDisableRecords(data) {
  return request({
    url: '/app/disableRecords',
    method: 'post',
    data: data
  })
}

// 修改封禁管理
export function updateDisableRecords(data) {
  return request({
    url: '/app/disableRecords',
    method: 'put',
    data: data
  })
}

// 删除封禁管理
export function delDisableRecords(id) {
  return request({
    url: '/app/disableRecords/' + id,
    method: 'delete'
  })
}

// 用户解封
export function unbanUser(params) {
  return request({
    url: '/app/disableRecords/releaseByWtId',
    method: 'post',
    data: params
  })
}
