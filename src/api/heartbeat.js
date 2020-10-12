/**
 * 设备心跳数据
*/

import knexDB from '../utils/knex_db'
import {mqPublish} from './mq'
import _ from 'lodash'
const UUID = require('uuid')

import {getUser} from './user/userDao'

const queue = '/queue/heartbeat' // p2p通道


const data = {
    "user_guid":"",
    "user_id":0,
    "send_time":"",
    "status":"0",
    "del_flag":"0",
    "create_by":"",
    "create_time":"",
    "update_by":"",
    "update_time":""

}

/**
 * 暴露心跳方法
 */
export function heartbeat(){
    getHeartbeatData(heartbeatData=>{
        sendMq(heartbeatData);
        saveDB(heartbeatData);
    });
}

function getHeartbeatData(callback){
    data.user_guid = UUID.v1();
    data.send_time = new Date();
    
    getUser().then(user=>{
        console.log(user)
        data.user_id = user[0].userid;
        data.create_by = user[0].username;
        callback(data);
    });
}

/**
 * 心跳信息转成String上报
 * @param {*} data 
 */
function sendMq(data){
    mqPublish(queue, JSON.stringify(data));
}

function saveDB(data){
    console.log('save heartbeat to db')
    knexDB.insert(data).into('t_user_heartlist')
    .catch(err=>console.error(err));

    // now表中没有user_guid字段
    let nData = _.cloneDeep(data);
    delete nData.user_guid;

    knexDB('t_user_heartlist_now').count('* as c').then(n=>{
        
        let count = n[0].c;
        
        if(count>0){
            knexDB('t_user_heartlist_now').update(nData).catch(err=>console.error(err));
        }else{
            knexDB.insert(nData).into('t_user_heartlist_now')
            .catch(err=>console.error(err));
        }
    })
}