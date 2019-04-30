import request from '@/utils/request'

export function getListPage(query) {
  return request({
    url: '/eoms/achievementLib/getListPage',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: query
  })
}
export function add(jsonData) {
  return request({
    url: '/eoms/achievementLib/add',
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    data: jsonData
  })
}
