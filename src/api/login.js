import request from '@/utils/request'
import qs from 'qs';

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}
// 获取身份信息
// 
export function getVerifyInfo(data) {
  return request({
    url: '/transmitData/verifyInfo',
    headers: {
      isToken: false,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    method: 'post',
    data: qs.stringify(data),
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}


// 获取验证码
export function getCodeImage(){
  return request({
    url: '/transmitData/getCodeImg',
    method: 'get',
    responseType: 'blob'
  })
}