import axios from '../axios'
import {searchSn} from './loginDao'

//获取验证码
export function captchaImage() {
    return axios({
        method: 'GET',
        url: '/captchaImage'
    })
}


//获取登录随机串
export function captchaStr(data) {
    return axios({
        method: 'GET',
        url: '/captchaStr',
        headers: data
    })
}

//用户第一次登录验证
export function loginTest(data) {
    return axios({
        method: 'POST',
        url: '/loginSimple',
        params: data
    })
}

//第一次客户端注册信息
export function register(data, header) {
    return axios({
        method: 'POST',
        url: '/api/client/register',
        params: data,
        headers: header
    })
}


//获取客户端注册信息
export function getRegister(header) {
    return axios({
        method: 'GET',
        url: '/api/client/info',
        headers: header
    })
}

//注销账户
export function logOff(header) {
    return axios({
        method: 'DELETE',
        url: '/api/client/logoff',
        headers: header
    })
}

//客户端登录（使用sn）
export function cLogin(data) {
    return axios({
        method: 'POST',
        url: '/cLogin',
        params: data
    })
}

//更新个人信息
export function editUserinfo(header, userinfo) {
    return axios({
        method: 'PUT',
        url: '/api/client/userinfo',
        headers: header,
        params: userinfo
    })
}

// 用户密码重置
export function updateUserPwd(header, oldPassword, newPassword) {
    const data = {
        oldPassword,
        newPassword
    }
    return axios({
        url: '/system/user/profile/updatePwd',
        method: 'PUT',
        headers: header,
        params: data
    })
}

export function searchSnApi() {
    return new Promise((resolve, reject) => {
        try {
            searchSn().then(res => {
                resolve(res);
            })
        } catch (error) {
            reject(error)
        }
    });
}