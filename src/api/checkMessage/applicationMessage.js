import request from '@/utils/request'

// 查询申请人信息列表
export function listApplicationMessage(query) {
  return request({
    url: '/checkMessage/applicationMessage/list',
    method: 'get',
    params: query
  })
}

// 查询申请人信息详细
export function getApplicationMessage(id) {
  return request({
    url: '/checkMessage/applicationMessage/' + id,
    method: 'get'
  })
}

// 查询申请失败原因说明
export function getProblemDescription(id) {
  return request({
    url: '/checkMessage/applicationMessage/problemDescription/' + id,
    method: 'get'
  })
}

// 撤回人信息详细
export function revocationDate(id) {
  return request({
    url: '/checkMessage/applicationMessage/revocation/' + id,
    method: 'get'
  })
}

// 新增申请人信息
export function addApplicationMessage(data) {
  return request({
    url: '/checkMessage/applicationMessage',
    method: 'post',
    data: data
  })
}

// 修改申请人信息
export function updateApplicationMessage(data) {
  return request({
    url: '/checkMessage/applicationMessage',
    method: 'put',
    data: data
  })
}
// 注销-修改申请人信息
export function zxupdateApplicationMessage(data) {
  return request({
    url: '/checkMessage/applicationMessage/logoff',
    method: 'post',
    data: data
  })
}


// 删除申请人信息
export function delApplicationMessage(id) {
  return request({
    url: '/checkMessage/applicationMessage/' + id,
    method: 'delete'
  })
}

// 注销注册的附件查询
export function getAttachmentUrlDataByZx(id) {
  return request({
    url: '/checkMessage/applicationMessage/zxFileData/' + id,
    method: 'get'
  })
}


// 多文件上传
export function uploads(data) {
  return request({
    url: '/common/uploads',
    method: 'post',
    params: data
  })
}
