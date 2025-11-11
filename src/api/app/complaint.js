import request from '@/utils/request'

// 查询举报管理列表
export function listComplaint(query) {
  return request({
    url: '/app/complaint/list',
    method: 'get',
    params: query
  })
}

// 忽略
export function complaintBatchIgnore(ids) {
  return request({
    url: '/app/complaint/batchIgnore/' + ids,
    method: 'get',
  })
}

// 警告
export function complaintWarn(id) {
  return request({
    url: '/app/complaint/warn/' + id,
    method: 'get',
  })
}

// 封禁
export function complaintDisable(data) {
  return request({
    url: '/app/complaint/disable',
    method: 'post',
    data: data
  })
}

