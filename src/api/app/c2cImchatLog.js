import request from '@/utils/request'

// 查询单聊聊天记录列表
export function listC2cImchatLog(query) {
  return request({
    url: '/api/c2cLog/list',
    method: 'get',
    params: query
  })
}

// 删除聊天记录，参数：
export function delC2cImchatLog(data) {
  return request({
    url: '/api/c2cLog/del',
    method: 'post',
    data: data
  })
}


