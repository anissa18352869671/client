import axios from './axios'
import knexDB from '../utils/knex_db'

const table = "t_session"

function initSession() {
    //删除表
    // knexDB.schema.dropTable(table).then(function () {

    // });
    // //判断表是否存在
    knexDB.schema.hasTable(table).then(function (exists) {});

    //初始化表格
    knexDB.schema.createTableIfNotExists(table, function (t) {
        t.increments('id').primary();
        t.string('userid', 100);
        t.string('usersn', 100);
        t.string('username', 100);
        t.string('uuid', 100);
        t.string('token', 100);
        t.timestamps();
        // console.log('create table ok!')
    }).then(function () {
        knexDB(table).select().then(function (rows) {
            // console.log("knexTable:" + JSON.stringify(rows))
        })
    })
}

//初始化用户表
initSession()

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
        url: '/login',
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

export function deleteTable() {
    //删除表
    knexDB.schema.dropTable(table).then(function () {

    });
}

//将usersn等信息存入本地sql
export function insertSession(data) {
    return new Promise((resolve, reject) => {
        try {

            knexDB(table).count('id').then(function (res) {
                res = res[0];

                Object.keys(res).forEach(function (key) {
                    // console.log(res[key]);
                    res = res[key];
                });

                if (res == 0) {
                    knexDB.insert({
                        userid: data.userid,
                        usersn: data.usersn,
                        username: data.username,
                        uuid: data.uuid,
                        token: data.token
                    }).into(table).catch(function (err) {
                        console.error(err);
                    });
                } else {
                    knexDB.update({
                        userid: data.userId,
                        usersn: data.userSn,
                        uuid: data.uuid,
                        token: data.token
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

//客户端登录（使用sn）
export function cLogin(data) {
    // console.log(data)
    // console.log(data);
    return axios({
        method: 'POST',
        url: '/cLogin',
        params: data
    })
}

//查询客户端sn
// searchSn();
export function searchSn() {
    return new Promise((resolve, reject) => {
        try {
            knexDB(table).select().then(function (rows) {
                // console.log(rows)
                resolve(rows)
            });
        } catch (err) {
            return reject(err)
        }
    })
}

//通过注册的sn实时获取token
export function getToken() {
    // console.log("getToken")
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
                // console.log("token");
                // console.log(res1.data.token)
                // console.log(res1);
            });
        });
    });
}