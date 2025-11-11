import request from '@/utils/request'

// 查询群朋友圈列表
export function listFriendsCircle(query) {
  return request({
    url: '/app/friendsCircle/list',
    method: 'get',
    params: query
  })
}

// 操作朋友圈
// {
//   "id": 0,
//   "friendsCircleStatus": 0
// }
export function setFriendsCircle(data) {
  return request({
    url: '/app/friendsCircle/set',
    method: 'post',
    data: data
  })
}
