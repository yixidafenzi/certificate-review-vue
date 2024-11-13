/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/* 合法邮箱 */
export function validateEmail(rule, value, callback) {
  const emailReg = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})$/
  if (!value) {
    return callback(new Error('邮箱不能为空!!'))
  }
  setTimeout(() => {
    if (!emailReg.test(value)) {
      return callback(new Error('邮箱格式错误'))
    } else {
      callback()
    }
  }, 100)
}
 
/* 合法手机号 */
export function validatePhone(rule, value, callback) {
  const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
  if (!value) {
    return callback(new Error('手机号码不能为空!!'))
  }
  setTimeout(() => {
    if (!phoneReg.test(value)) {
      return callback(new Error('手机号码格式错误'))
    } else {
      callback()
    }
  }, 100)
}
 
/* 合法身份证 */
export function validateIdNumber(rule, value, callback) {
  const idNumberReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  if (!value) {
    return callback(new Error('身份证号码不能为空!'))
  }
  setTimeout(() => {
    if (!idNumberReg.test(value)) {
      return callback(new Error('您的身份证号码格式错误!'))
    } else {
      callback()
    }
  }, 100)
}

/* 合法军官证或士兵证 */
export function validateOfficerNumber(rule, value, callback) {
  const officerNumberReg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
  // 规则： 军/兵/士/文/职/广/（其余中文） + "字第" + 4到8位字母或数字 + "号"
  // 样本： 军字第2001988号, 士字第P011816X号
  if (!value) {
    return callback(new Error('军官证号码不能为空!'))
  }
  setTimeout(() => {
    if (!officerNumberReg.test(value)) {
      return callback(new Error('您的军官证号码格式错误!'))
    } else {
      callback()
    }
  }, 100)
}

