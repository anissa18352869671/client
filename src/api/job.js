/**
 * 定时任务接口
 */
const schedule = require('node-schedule');
import {
    heartbeat
} from './heartbeat'
import {
    readNmapXml
} from './device/readNmapXml'

import {
    toFindResultJob
} from './tasks/taskToolsAssetDao'

import {
    toChangeStateJob
} from './tasks/taskToolsDao'

//"*/3 * * * * *" 三秒一次 
//"0 */10 * * * *" 每10分钟执行一次
const job = "0 0 * * * *"
const job5 = "0 */5 * * * *"
const readXmlJob = "0 */2 * * * *"; //10秒一次

//定时发送心跳数据
const heartbeatJob = () => {
    schedule.scheduleJob(job, () => {
        console.log('start publish job')
        heartbeat();
        console.log('heartbeatJob: ' + new Date())
    })
}

//定时读取结果xml
const readNmapXmlJob = () => {
    schedule.scheduleJob(readXmlJob, () => {
        console.log('start read nmap xml job')
        readNmapXml();
    })
}

//工具引擎状态同步
const toolManageJob = () => {
    schedule.scheduleJob(job5, () => {
        console.log('start toolManageJob job')
        /**
         * 定期去引擎拿任务结果
         */
        toFindResultJob();
        /**
         * 定期查找资产子表，变更工具结果状态
         */
        toChangeStateJob()
        console.log('toolManageJob: ' + new Date())
    })
}

let heartbeatJob_ = null;
let readNmapXmlJob_ = null;
let toolManageJob_ = null;

//启动
if (heartbeatJob_ == null) {
    console.log('init heartbeatJob')
    heartbeatJob_ = heartbeatJob();
}

if (readNmapXmlJob_ == null) {
    console.log('init readNmapXmlJob')
    readNmapXmlJob_ = readNmapXmlJob();
}

if (toolManageJob_ == null) {
    console.log('init toolManageJob')
    toolManageJob_ = toolManageJob();
}


