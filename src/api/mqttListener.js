/**
 * mqtt 支持持续订阅
 */
const mqtt = require('mqtt');
import res from '../../resources.json'
const osInfo = require('./os');
/** listener 开始 */
import {
    syncListener
} from './synclistener'
import {
    tasklistener
} from './tasks/taskListener'
import {
    newsListener
} from './news/newsListener'
import {
    noticeListener
} from './notice/noticeListener'
import {
    webListener
} from './web/webListener'

import {
    searchSn
} from './login/loginDao'

/** listener 结束 */
let mac = osInfo.getMac();
// 用本机的mac地址作为clientId，持续订阅必须有唯一的clientId
let clientid = "c-mac:" + mac;
let opt = {
    port: res.mq.mqttport,
    clientId: clientid,
    clean: false
};
let client = mqtt.connect('mqtt://' + res.mq.host, opt);
/**
 * topiclist【订阅列表】
 * 配置同步 topic_configUpdateSignal
 * 任务监听 topic_task
 * 新闻监听 topic_newsinfo
 * 通知通报 notice2c
 * 网站监测 topic_scanproxy
 */
let topiclist = ['topic_configUpdateSignal','topic_task','topic_newsinfo',
'notice2c','topic_scanproxy'];

export function mqttListener() {
    console.log('mqtt订阅' + JSON.stringify(topiclist));
    client.on('connect', function () {
        client.subscribe(topiclist, {
            qos: 1,
            'no-clean': false
        });
    });
}
mqttListener();

client.on('message', function (topic, message) {
    let resultJson;
    try {
        resultJson = JSON.parse(message);
    } catch (err) {
        console.log("JsonErr" + err);
        console.log("error:" + message);
        return;
    }
  delete resultJson['params'];
    searchSn().then(res => {
        if (res.length > 0) {
            if (topic == 'topic_configUpdateSignal') {
                syncListener(resultJson);
            } else if (topic == 'topic_task') {
                // console.log("topic_task*****************************")
                tasklistener(resultJson);
            } else if (topic == 'topic_newsinfo') {
                newsListener(resultJson);
            } else if (topic == 'notice2c') {
                noticeListener(resultJson);
            } else if (topic == 'topic_scanproxy') {
                webListener(resultJson);
            } else {
                console.info("未知的处理" + topic);
            }
        }
    })

})