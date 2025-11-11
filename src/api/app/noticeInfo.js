import request from '@/utils/request'

// 查询公告消息列表
export function listNoticeInfo(query) {
  return request({
    url: '/app/noticeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询公告消息详细
export function getNoticeInfo(id) {
  return request({
    url: '/app/noticeInfo/' + id,
    method: 'get'
  })
}

// 新增公告消息
export function addNoticeInfo(data) {
  return request({
    url: '/app/noticeInfo',
    method: 'post',
    data: data
  })
}

// 修改公告消息
export function updateNoticeInfo(data) {
  return request({
    url: '/app/noticeInfo',
    method: 'put',
    data: data
  })
}

// 删除公告消息
export function delNoticeInfo(id) {
  return request({
    url: '/app/noticeInfo/' + id,
    method: 'delete'
  })
}

// 发送公告消息
export function sendNotice(id) {
  return request({
    url: '/app/noticeInfo/sendNotice/' + id,
    method: 'get'
  })
}
