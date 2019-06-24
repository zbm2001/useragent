const global = new Function('return this')();
const isClient = typeof window === "object" && window === global
const isServer = !isClient

let hashCache = {}

let cacheSize = 0

const userAgent = isClient ? global.navigator.userAgent : ''

export const userAgentDetector = {
  test,
  clear,
  parse,
  detectHasMobile: (ua) => /Mobile/i.test(ua),
  detectHasTablet: (ua) => /Tablet/i.test(ua),

  detectChrome: (ua) => /Chrome/i.test(ua),
  detectSilk: (ua) => /Silk/i.test(ua),

  detectWindows: (ua) => /Windows/i.test(ua),
  detectWindowsPhone: (ua) => userAgentDetector.detectWindows(ua) && /Phone/i.test(ua),
  detectWindowsTablet: (ua) => userAgentDetector.detectWindows(ua) && !userAgentDetector.detectWindowsPhone(ua) && /touch/i.test(ua),

  detectMac: (ua) => /Macintosh/i.test(ua),
  detectIPhone: (ua) => !userAgentDetector.detectWindows && /iPhone/i.test(ua),
  detectIPad: (ua) => /iPad/i.test(ua),
  detectIPod: (ua) => /iPod/i.test(ua),
  detectIOS: (ua) => userAgentDetector.detectIPhone(ua) || userAgentDetector.detectIPad(ua) || userAgentDetector.detectIPod(ua),
  detectIOSMac: (ua) => userAgentDetector.detectIOS(ua) || userAgentDetector.detectMac(ua),

  detectAndroid: (ua) => !userAgentDetector.detectWindows(ua) && /Android/i.test(ua),
  detectAndroidPhone: (ua) => userAgentDetector.detectAndroid(ua) && userAgentDetector.detectHasMobile(ua),
  detectAndroidTablet: (ua) => userAgentDetector.detectAndroid(ua) && !userAgentDetector.detectHasMobile(ua),

  detectMicroMessenger: (ua) => /MicroMessenger/i.test(ua),

  detectBlackberry: (ua) => /Blackberry/i.test(ua) && /bb10/i.test(ua) && /rim/i.test(ua),
  detectBlackberryPhone: (ua) => userAgentDetector.detectBlackberry(ua) && !userAgentDetector.detectHasTablet(ua),
  detectBlackberryTablet: (ua) => userAgentDetector.detectBlackberry(ua) && userAgentDetector.detectHasTablet(ua),

  detectFxos: (ua) => (/\(Mobile;/i.test(ua) || /\(Tablet;/i.test(ua)) && /; rv:/i.test(ua),
  detectFxosPhone: (ua) => userAgentDetector.detectFxos(ua) && userAgentDetector.detectHasMobile(ua),
  detectFxosTablet: (ua) => userAgentDetector.detectFxos(ua) && userAgentDetector.detectHasTablet(ua),

  detectMeego: (ua) => /Meego/i.test(ua),

  detectMobile: (ua) => userAgentDetector.detectWindowsPhone(ua) || userAgentDetector.detectIPhone(ua) || userAgentDetector.detectIPod(ua) || userAgentDetector.detectAndroidPhone(ua) || userAgentDetector.detectBlackberryPhone(ua) || userAgentDetector.detectFxosPhone(ua) || userAgentDetector.detectMeego(ua),

  detectCordova: (ua) => isClient && !!global.cordova && global.location.protocol === 'file:',

  detectNodeWebkit: (ua) => !!global.window && typeof global.process === 'object',

  detectAndroidVersion: (ua) => userAgentDetector.detectAndroid(ua) && /Android\s+(\d+(?:.\d+)*)/i.test(ua) && RegExp.$1,

  detectMicroMessengerVersion: (ua) => userAgentDetector.detectMicroMessenger(ua) && /MicroMessenger\/(\d+\.\d+\.\d+)/.test(ua) && RegExp.$1
}

const _uad = Object.create(userAgentDetector)

// 客户端环境只有一个 userAgent
if (isClient) {
  parse(global.navigator.userAgent, _uad)
  hashCache[_uad.userAgent] = _uad
}

export function clear () {
  hashCache = {}
  if (isClient && _uad.userAgent) hashCache[_uad.userAgent] = _uad
  cacheSize = isClient ? 1 : 0
}

/**
 * 对一个用户代理描述（非空字符串）做检测解析
 * @param {String} userAgent Non empty string
 *   非空字符创
 * @param {Boolean} needCache Specifies whether to cache to speed up
 *   指定是否缓存，以提升执行速度
 * @returns {Object} 解析出的对象
 */
export function test (userAgent, needCache) {
  if (!userAgent || typeof userAgent !== 'string') {
    userAgent = ''
    // throw new TypeError('UserAgent must be a non empty string!')
  }
  let uad = hashCache[userAgent]
  if (uad) return uad
  uad = parse(userAgent, Object.create(userAgentDetector))
  if (needCache) {
    cacheSize > 10000 && clear()
    hashCache[userAgent] = uad
    cacheSize++
  }
  return uad
}

/**
 * 对一个用户代理描述（非空字符串）做检测解析
 * @param {String} ua Non empty string
 *   非空字符创
 * @param {Object} o Predefined parsed mount object, Optional
 *   预定义解析的挂载对象，可选项
 * @returns {Object}
 */
export function parse (ua, o) {
  if (!o) {
    o = Object.create(userAgentDetector, {
      userAgent: {
        value: ua
      }
    })
  }
  o.userAgent = ua
  o.hasMobile = o.detectHasMobile(ua)
  o.hasTablet = o.detectHasTablet(ua)

  o.isChrome = o.detectChrome(ua)
  o.isSilk = o.detectSilk(ua)

  o.isWindows = o.detectWindows(ua)
  o.isWindowsPhone = o.isWindows && /Phone/i.test(ua)
  o.isWindowsTablet = o.isWindows && !o.isWindowsPhone && /touch/i.test(ua)

  o.isMac = o.detectMac(ua)
  o.isIPhone = !o.isWindows && /iPhone/i.test(ua)
  o.isIPad = o.detectIPad(ua)
  o.isIPod = o.detectIPod(ua)
  o.isIOS = o.isIPhone || o.isIPad || o.isIPod
  o.isIOSMac = o.isIOS || o.isMac

  o.isAndroid = !o.isWindows && /Android/i.test(ua)
  o.isAndroidPhone = o.isAndroid && o.hasMobile
  o.isAndroidTablet = o.isAndroid && !o.hasMobile

  o.isMicroMessenger = o.detectMicroMessenger(ua)

  o.isBlackberry = o.detectBlackberry(ua)
  o.isBlackberryPhone = o.isBlackberry && !o.hasTablet
  o.isBlackberryTablet = o.isBlackberry && o.hasTablet

  o.isFxos = o.detectFxos(ua)
  o.isFxosPhone = o.isFxos && o.hasMobile
  o.isFxosTablet = o.isFxos && o.hasTablet

  o.isMeego = o.detectMeego(ua)

  o.isMobile = o.isWindowsPhone || o.isIPhone || o.isIPod || o.isAndroidPhone || o.isBlackberryPhone || o.isFxosPhone || o.isMeego

  o.isCordova = isClient && !!global.cordova && global.location.protocol === 'file:'

  o.isNodeWebkit = !!global.window && typeof global.process === 'object'

  o.androidVersion = o.isAndroid && /Android\s+(\d+(?:.\d+)*)/i.test(ua) && RegExp.$1

  o.microMessengerVersion = o.isMicroMessenger && /MicroMessenger\/(\d+\.\d+\.\d+)/i.test(ua) && RegExp.$1

  return o
}

export default _uad

// export default {
//   // 方法
//   test,
//   clear,
//   parse,
//   // 属性
//   userAgent,
//   hasMobile,
//   hasTablet,
//   isChrome,
//   isSilk,
//   isWindows,
//   isWindowsPhone,
//   isWindowsTablet,
//   isIOSMac,
//   isMac,
//   isIOS,
//   isIPhone,
//   isIPad,
//   isIPod,
//   isAndroid,
//   isAndroidPhone,
//   isAndroidTablet,
//   isBlackberry,
//   isBlackberryPhone,
//   isBlackberryTablet,
//   isFxua,
//   isFxosPhone,
//   isFxosTablet,
//   isMeego,
//   isMobile,
//   isCordova,
//   isNodeWebkit,
//   androidVersion,
//   microMessengerVersion
// }
