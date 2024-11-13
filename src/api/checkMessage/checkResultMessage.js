import request from '@/utils/request'

// 查询审核结果信息列表
export function listCheckResultMessage(query) {
  return request({
    url: '/checkMessage/checkResultMessage/list',
    method: 'get',
    params: query
  })
}

// 查询审核结果信息详细
export function getCheckResultMessage(id) {
  return request({
    url: '/checkMessage/checkResultMessage/' + id,
    method: 'get'
  })
}

//申请数据文件下载
export function downloadFileZipById(id) {
  return request({
    url: '/checkMessage/checkResultMessage/download/' + id,
    method: 'get'
  })
}

// 新增审核结果信息（审核通过）
export function addCheckResultMessageSucceed(data) {
  return request({
    url: '/checkMessage/checkResultMessage/succeed',
    method: 'get',
    params: data
  })
}

// 新增审核结果信息（审核不通过）
export function addCheckResultMessageFail(data) {
  return request({
    url: '/checkMessage/checkResultMessage/fail',
    method: 'get',
    params: data
  })
}

// 修改审核结果信息
export function updateCheckResultMessage(data) {
  return request({
    url: '/checkMessage/checkResultMessage',
    method: 'put',
    params: data
  })
}

// 证书下发中撤回
export function withdrawalDuringIssuance(data) {
  return request({
    url: '/checkMessage/checkResultMessage/withdrawalDuringIssuance',
    method: 'post',
    params: data
  })
}

//已下发证书撤回
export function issuedWithdrawal(data) {
  return request({
    url: '/checkMessage/checkResultMessage/issuedWithdrawal',
    method: 'post',
    params: data
  })
}


// 删除审核结果信息
export function delCheckResultMessage(id) {
  return request({
    url: '/checkMessage/checkResultMessage/succeed/' + id,
    method: 'delete'
  })
}

// 查看审核结果信息
export function queryCheckResultMessage(id) {
  return request({
    url: '/checkMessage/checkResultMessage/queryInfo/' + id,
    method: 'get',
  })
}

// 注销注册的附件查询
export function getAttachmentUrlDataByZx(id) {
  return request({
    url: '/checkMessage/applicationMessage/zxFileData/' + id,
    method: 'get'
  })
}

// 证书历史沿革

export function certificateHistory(idNumber) {
  return request({
    url: '/checkMessage/checkResultMessage/queryInfoYg/' + idNumber,
    // url: '/checkMessage/checkResultMessage/queryInfoYg/412326199911234888' ,
    method: 'get'
  })
}

