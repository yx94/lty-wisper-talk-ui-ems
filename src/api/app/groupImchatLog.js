import request from '@/utils/request'

// 查询群聊聊天记录列表
export function listGroupImchatLog(query) {
  return request({
    url: '/api/group/list',
    method: 'get',
    params: query
  })
}

// 删除聊天记录，参数：
export function delGroupImchatLog(data) {
  return request({
    url: '/api/group/del',
    method: 'post',
    data: data
  })
}
