/**
 * 用户session的数据库操作
 */
import resConf from '../../../resources.json'
import knexDB from '../../utils/knex_db'
import {formatDateTime} from '../../utils/utils'
import {
    captchaStr,
    cLogin
} from "./login";

const table = "t_session"
//  token有效时间-分钟
const sessiontime = resConf.server.enableTokenMinute


//将usersn等信息存入本地sql
export function insertSession(data) {
    // console.log("insertSession")
    return new Promise((resolve, reject) => {
        try {

            knexDB(table).count('id').then(function (res) {
                res = res[0];

                Object.keys(res).forEach(function (key) {
                    // console.log(res[key]);
                    res = res[key];
                });
                let nowdate = formatDateTime(new Date(),"yyyy-MM-dd HH:mm:ss");
                if (res == 0) {
                    knexDB.insert({
                        userid: data.userid,
                        usersn: data.usersn,
                        username: data.username,
                        uuid: data.uuid,
                        token: data.token,
                        created_at: nowdate,
                        updated_at: nowdate,
                        phonenumber: data.phonenumber,
                        email: data.email,
                        sex: data.sex,
                        avatar: data.avatar,
                        unit_name: data.unitname,
                        nick_name: data.nickname,
                        dept_name: data.deptname
                    }).into(table).catch(function (err) {
                        console.error(err);
                    });
                    // syncInit();
                } else {
                    knexDB.update({
                        userid: data.userId,
                        usersn: data.userSn,
                        uuid: data.uuid,
                        token: data.token,
                        updated_at: nowdate
                    }).into(table).catch(function (err) {
                        console.error(err);
                    });
                }
            })

        } catch (err) {
            return reject(err)
        }
    })
}



//查询客户端sn
// searchSn();
export function searchSn() {
    return new Promise((resolve, reject) => {
        try {
            knexDB(table).select().then(function (rows) {
                resolve(rows)
            });
        } catch (err) {
            return reject(err)
        }
    })
}

// 刷新token
export function refreshToken() {
    return new Promise(function(resolve,reject){
        searchSn().then(function (res) {
            res = res[0];
            captchaStr({
                csn: res.usersn
            }).then(function (result) {
                cLogin({
                    username: res.username,
                    user_sn: res.usersn,
                    uuid: result.data.uuid
                }).then(function (res1) {
                    insertSession(res1.data);
                    resolve(res1.data.token)
                });
            });
        });
    });
}

//获取当前的token，过期了就重新取一遍
export function getNowToken() {
    return new Promise(function(resolve,reject){
        try {
            let token;
            searchSn().then(function (res) {
                res = res[0];
                token = res.token;
                const nowtime = new Date().valueOf();
                const tokentime = new Date(res.updated_at).valueOf();
                let min = Math.floor(((nowtime-tokentime) / 1000)/60);
                // console.info("token_min:"+min);
                if(min>sessiontime) {
                    refreshToken().then(function(resT) {
                        // console.info("refreshToken:"+resT);
                        resolve(resT)
                    })
                } else {
                    // console.info("searchSnToken:"+token);
                    resolve(token)
                }
            });
        } catch (err) {
            return reject(err)
        }
    });
}

//通过注册的sn实时获取token
export function getToken() {
    searchSn().then(function (res) {
        res = res[0];
        captchaStr({
            csn: res.usersn
        }).then(function (result) {
            cLogin({
                username: res.username,
                user_sn: res.usersn,
                uuid: result.data.uuid
            }).then(function (res1) {
                insertSession(res1.data);
            });
        });
    });
}

/**个人信息维护 */
export function updateUserInfo(data) {
    return new Promise((resolve, reject) => {
        try {

            knexDB(table).count('id').then(function (res) {
                res = res[0];

                Object.keys(res).forEach(function (key) {
                    // console.log(res[key]);
                    res = res[key];
                });
                if (res == 0) {
                    return reject("NO SESSION DATA!")
                } 
                knexDB.update({
                    nickname: data.nickname,
                    avatar: data.avatar,
                    sex: data.sex,
                    email: data.email,
                    phonenumber: data.phonenumber
                }).into(table).catch(function (err) {
                    console.error(err);
                });
            })
        } catch (err) {
            return reject(err)
        }
    })
}

export function searchAccountInfo() {
    return new Promise((resolve, reject) => {
        try {
            knexDB(table).select().then(function (rows) {
                let res = rows[0];
                resolve(res)
            });
        } catch (err) {
            return reject(err)
        }
    })
}