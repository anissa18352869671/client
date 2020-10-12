import axios from 'axios'
import Vue from 'vue';
import res from '../../resources.json'

/**
 * 云平台
 */
const _url = res.server.apiUrl||"http://localhost/dev-api";
Vue.prototype.$httpUrl = _url;

/**
 * 漏洞资源库
 */
const cnnvd_api_url = res.cnnvd.apiUrl||"http://localhost:8080/vuln";

const instance = axios.create({
  // basic url
  baseURL: _url,
  // 超时时间
  timeout: 3000,
  withCredentials: true
})

export const cnnvdInstance = axios.create({
  // basic url
  baseURL: cnnvd_api_url,
  // 超时时间
  timeout: 60000,
  withCredentials: true
})


export default instance;