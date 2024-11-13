import request from '@/utils/request'

// 查询单点登录列表
export function listSsologininfor(query) {
  return request({
    url: '/system/ssologininfor/list',
    method: 'get',
    params: query
  })
}

// 查询单点登录详细
export function getSsologininfor(infoId) {
  return request({
    url: '/system/ssologininfor/' + infoId,
    method: 'get'
  })
}

// 新增单点登录
export function addSsologininfor(data) {
  return request({
    url: '/system/ssologininfor',
    method: 'post',
    data: data
  })
}

// 修改单点登录
export function updateSsologininfor(data) {
  return request({
    url: '/system/ssologininfor',
    method: 'put',
    data: data
  })
}

// 删除单点登录
export function delSsologininfor(infoId) {
  return request({
    url: '/system/ssologininfor/' + infoId,
    method: 'delete'
  })
}
