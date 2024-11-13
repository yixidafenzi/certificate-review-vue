import request from '@/utils/request'

// 查询系统注册信息列表
export function listSignupinfor(query) {
  return request({
    url: '/system/signupinfor/list',
    method: 'get',
    params: query
  })
}

// 查询系统注册信息详细
export function getSignupinfor(infoId) {
  return request({
    url: '/system/signupinfor/' + infoId,
    method: 'get'
  })
}

// 新增系统注册信息
export function addSignupinfor(data) {
  return request({
    url: '/system/signupinfor',
    method: 'post',
    data: data
  })
}

// 修改系统注册信息
export function updateSignupinfor(data) {
  return request({
    url: '/system/signupinfor',
    method: 'put',
    data: data
  })
}

// 删除系统注册信息
export function delSignupinfor(infoId) {
  return request({
    url: '/system/signupinfor/' + infoId,
    method: 'delete'
  })
}
