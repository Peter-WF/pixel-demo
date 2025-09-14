(function(){
  window.initTikTokMockJSB = function(){

    function addJSBHistory(jsbName, data) {
      if (!window.JSB) {
        window.JSB = {}
      }

      if (!window.JSB[jsbName]) {
        window.JSB[jsbName] = []
      }
      window.JSB[jsbName].push(data)
    }

    const log_extra = JSON.stringify({
      'ad_slot_type': 7,
      'oaid': '',
      'language': 'golang',
      'ug_creative_id': '',
      'ad_id': 1714133342665761,
      'creative_id': 1714133350021137,
      'convert_id': 0,
      'uid': 274855994953158,
      'ad_type': 1,
      'pricing': 9,
      'ut': 14,
      'version_code': '3.0.0',
      'device_id': 274855994953158,
      'width': 1242,
      'height': 2688,
      'mac': '',
      'uuid': '',
      'uuid_md5': '',
      'os': 'ios',
      'client_ip': '210.2.210.228',
      'open_udid': '',
      'os_type': null,
      'app_name': '\u30c8\u30ea\u30de',
      'device_type': 'iPhone11,6',
      'os_version': '14.7.1',
      'app_id': '5098960',
      'template_id': 0,
      'template_rate': 0,
      'promotion_type': 0,
      'img_gen_type': 0,
      'img_md5': '',
      'source_type': 1,
      'pack_time': 1635810846.257975,
      'cid': 1714133350021137,
      'interaction_type': 3,
      'src_type': 'app',
      'package_name': 'jp.co.incrementp.MileMobile',
      'pos': 5,
      'landing_type': 1,
      'is_sdk': true,
      'is_dsp_ad': false,
      'idfa': 'E6B0FBA8-83AB-4733-BBA1-FF154A35737A',
      'placement': 'Pangle',
      'req_id': 'E0C4D08A-E3E2-43A8-BE13-7BC83FBCD633u8266',
      'rit': 945486465,
      'vid': '70156749,70293797,1009353,1365707,70042199,70093955,70093965,70254630,70268551,70281570,70287720,70294530,70298672,70299613,70300326,70300695,70300864,70301047,70302867,70302983,70303099,70305135,1726985,1729258,1752292',
      'orit': 900000000,
      'ad_price': 'YXu1CgADeORhe7UKAAN45BottXTB7k28TNrkDA',
      'dynamic_ptpl_id': 2428,
      'show_type': 1,
      'engine_external_url': '',
      'engine_web_url': '',
      'variation_id': '',
      'app_bundle_id': 'jp.co.incrementp.MileMobile',
      'clickid': 'E.C.P.CpEBAUodF3gZ3rQ9Et4Ui3XSGty3-xGTgMGazT9uJGdoK5MUrBboJxnwH2-DaMx5xGA8uSiV4C4yJl9C4TlHEscFlXNDAhqmBpqFZxDYnZkS2dZALZCVYbyCUp9t9lu426qiMI-gpakxs6ngNbUm25wVHAeHi26mkQKHaJBr80wwTgC_PBU84pJ5Gz4th10b4MB1shIEdjIuMBogKVB1oE-_E4Nk7v1gXEp2p93YhVlksL_iYLSRjn4xYeU',
      'idfv': '04D21B2C-1E89-45EB-872D-1BE9ADE393A7',
      'ip': '210.2.210.228',
      'ua': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      'sys_language': 'ja-JP',
      'cover_click_area': 100,
      'playable_var_ids': '',
      'playable_template_var_id': 0,
      'country_id': 'JP',
      'province_id': 2113014,
      'city_id': 1861964,
      'dma_id': null,
      'playable_url': null,
      'dco_pl_strategy': null,
      'dy_pl_type': null,
      'dpa_video_id': null,
      'idc': 3, // "user_tracking_status": 0 // opt-in
      'user_tracking_status': 1 // opt-out
    })

    const defaultAdInfo = {
      req_id: 'req_id', creative_id: 'creative_id', cid: 'cid', ad_id: 'ad_id', log_extra, idc: 'idc'
    }

    const orDefaultAdInfo = { 'code': -2, 'respJsTime': '1655456566242', 'recvJsCallTime': '1655456566241' }

    const defaultAppInfo = {
      device_id: 1, user_id: 2, appVersion: 'app_version', versionCode: 'version_code', aid: '1180',

      req_id: '2020', convert_id: 11, uid: 12, ut: 'ut', version: 'version',

      device_platform: 'android'

    }

    const call = (fn, data, duration = 100) => {
      setTimeout(() => {
        fn(data)
      }, duration)
    }

    const toV3BridgeResult = (data) => {
      return {
        code: 1, data: data
      }
    }

    const adInfo = (data, cb) => {
      // debugger
      // console.log("bridge call adInfo",data);
      // call(cb, defaultAdInfo, 1000 * 6)
      // debugger
      call(cb, toV3BridgeResult(defaultAdInfo), 3 * 1000)
    }

    const appInfo = (data, cb) => {
      console.log('bridge call appInfo')
      // console.log(defaultAppInfo)
      call(cb, defaultAppInfo, 1000 * 1)
    }

    const sendLog = (data, cb) => {
      console.group('%c bridge call sendLog', 'color: green;')
      console.log(data)
      console.log(JSON.parse(data.extJson.trackLogData))
      console.groupEnd()
      // data.originWF = JSON.parse(data.extJson.trackLogData)
      call(cb, {
        code: 1, ret: 'test', data: {}
      }, 0)
    }

    const sendLogWithAdInfo = (data, cb) => {
      console.log('%c bridge call sendLogWithAdInfo' + JSON.stringify(data), 'color: red;')
      console.log(data)
      call(cb, {
        code: 1, // 1: success
        ret: 'test', data: {}
      }, 0)
    }

    const trackEvent = (data) => {
      console.log('%c bridge call track_event' + JSON.stringify(data), 'color: yellow;')
    }

    const getATTStatus = (data, cb) => {
      // debugger
      console.log('%c bridge call getATTStatus' + JSON.stringify(data), 'color: green;')
      // NOT_DETERMINED - 未弹出过弹窗，枚举值：0
      // RESTRICTED - 还有一种叫限制状态，这种状态非常少，多为家长限制，枚举值：1
      // DENIED - 弹窗后，用户点击拒绝授权，枚举值：2
      // AUTHORIZED - 弹窗后，用户点击允许授权，枚举值：3
      // export enum ATT_STATUS {
      //   NOT_DETERMINED = 0,
      //   RESTRICTED = 1,
      //   DENIED = 2,
      //   AUTHORIZED = 3,
      // }
      call(cb, {
        code: 1, respJsTime: '1619679164553', ATTStatus: 2, recvJsCallTime: '1619679164552'
      }, 100 * 1)
    }

    const updatePCMData = (data, cb) => {
      console.log('%c bridge call updatePCMData' + JSON.stringify(data), 'color: green;')
      return call(cb, {})
    }

    const updateFLLocalConv = (data, cb) => {
      console.log('%c bridge call updateFLLocalConv' + JSON.stringify(data), 'color: green;')
      return call(cb, {})
    }

    const sendAnalyticsEvent = (data, cb) => {
      console.group('%c bridge call sendAnalyticsEvent', 'color: green;')
      console.log(data)
      console.groupEnd()
      return call(cb, {
        code: 1, ret: 'test', data: {}
      }, 100)
    }

    Object.defineProperty(window, 'ToutiaoJSBridge', {
      get() {
        return {
          call(method, data, cb = () => {
          }) {
            console.log('ToutiaoJSBridge call:', method)
            addJSBHistory(method, data)
            switch (method) {
              case 'adInfo':
                adInfo(data, cb)
                break
              case 'appInfo':
                appInfo(data, cb)
                break
              case 'sendLog':
                sendLog(data, cb)
                break
              case 'sendLogWithAdInfo':
                sendLogWithAdInfo(data, cb)
                break
              case 'track_event':
                trackEvent(data, cb)
                break
              case 'getATTStatus':
                // debugger
                getATTStatus(data, cb)
                break
              case 'updatePCMData':
                updatePCMData(data, cb)
                break
              case 'sendAnalyticsEvent':
                sendAnalyticsEvent(data, cb)
                break
              case 'updateFLLocalConv':
                updateFLLocalConv(data, cb)
                break
            }
          }
        }
      }, set(v) {
      }
    })
    Object.defineProperty(window, 'JSBridge', {
      get() {
        return {
          call(method, data, cb = () => {
          }) {
            console.log('ToutiaoJSBridge call:', method)
            switch (method) {
              case 'adInfo':
                adInfo(data, cb)
                break
              case 'appInfo':
                appInfo(data, cb)
                break
              case 'sendLog':
                sendLog(data, cb)
                break
              case 'sendLogWithAdInfo':
                sendLogWithAdInfo(data, cb)
                break
              case 'track_event':
                trackEvent(data, cb)
                break
              case 'getATTStatus':
                getATTStatus(data, cb)
                break
              case 'updatePCMData':
                updatePCMData(data, cb)
                break
              case 'sendAnalyticsEvent':
                sendAnalyticsEvent(data, cb)
                break
              case 'updateFLLocalConv':
                updateFLLocalConv(data, cb)
                break
            }
          }
        }
      }, set(v) {
      }
    })
  }
})();

