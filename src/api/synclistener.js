import {
    humpToUnderlineJson
} from '../utils/utils';

import {
    startDownloadTask
} from '../utils/func/download';

import res from '../../resources.json'

import {
    getNowToken
} from "../api/login/loginDao";

// 字典表字典表更新（sys_dict_data）
import {
    getDicList
} from '../api/dict/dict';
import {
    saveDict
} from '../api/dict/dictDao';

// 标签字典（sys_label）
import {
    getList as getLabelList
} from '../api/label/label';
import {
    insertLabel,
    updateDelFlag as labelDel
} from '../api/label/labelDao';

// 工具类型（tools_type）
import {
    getOftenList,
    getPackList,
    getList as getToolsList,
    getListType
} from '../api/setting/settingApi';
import {
    saveToolsType,
    updateDelFlag as toolsTypeDel
} from '../api/setting/settingTypeDao';

// 工具列表（tools）
import {
    saveTools,
    updateDelFlag as toolsDel
} from '../api/setting/settingDao';

// 套餐列表（pack）
import {
    savePackData,
    updateDelFlag as packDel
} from '../api/setting/packListDao';
// import {savePackTools, updatePackToolsList, insertPackToolsList} from '../api/setting/packToolsDao';

// 套餐购买时长（often）
import {
    saveOftenData,
    updateDelFlag as oftenDel
} from '../api/setting/oftenDao';

import {getVersionList} from '../api/update/updateApi';
import {saveVersion, updateDelDatas} from  '../api/update/updateDao';

// 工具参数表维护
import {getListParamet} from '../api/setting/toolsParamsApi';
import {saveData as saveToolsParamsData,
    updateDelFlag as updateTPDelFlag} from '../api/setting/toolsParamsDao';

// 配置更新信号
export function syncListener(json) {
    console.info("系统配置更新：" + JSON.stringify(json));
    let signal = humpToUnderlineJson(json);
    let mode = signal.update_model; // 需要同步的模块
    if ("sys_dict_data" == mode) { // 字典表同步
        syncDictData();
    } else if ("sys_label" == mode) { // 订阅标签字典
        syncLabelData();
    } else if ("tools_type" == mode) { // 工具类型字典
        syncToolsTypeData();
    } else if ("tools" == mode) { // 工具列表
        syncToolsData();
    } else if ("pack" == mode) { // 套餐变更
        syncPackData();
    } else if ("often" == mode) { // 套餐购买时长
        syncOftenData();
    } else if ('client_version' == mode) {//客户端版本信息
        syncClientVersionInfo();
    } else if('toolsParamet' == mode) {// 工具参数
        syncToolsParamet();
    }
}

// 工具参数配置变更
export function syncToolsParamet() {
    getNowToken().then(function (token) {
        getListParamet({
            Authorization: "Bearer " + token
        }).then(function (result) {
            let datas = result.data.data;
            let availableDatas = [];
            for (let i in datas) {
                let obj = entityJsondefaultHandle(datas[i]);
                // console.info(JSON.stringify(obj));
                availableDatas.push(obj.tools_parameter_guid);
                saveToolsParamsData(obj, function(){});
            }
            if (availableDatas.length > 0) {
                updateTPDelFlag(availableDatas);
            }
        });
    }); 
}

// 客户端版本信息列表
export function syncClientVersionInfo() {
    getNowToken().then(function (token) {
        getVersionList({
            Authorization: "Bearer " + token
        }).then(function (result) {
            let datas = result.data.data;
            let availableDatas = [];
            for (let i in datas) {
                let version = {};
                availableDatas.push(datas[i].update_version);
                version['update_version'] = datas[i].update_version;
                version['update_content'] = datas[i].update_content;
                version['create_time'] = datas[i].create_time;
                version['create_by'] = datas[i].release_date;
                version['update_time'] = datas[i].update_time;
                version['update_by'] = datas[i].update_by;
                version['is_now'] = 0;
                saveVersion(version, function () {

                });
            }
            if (availableDatas.length > 0) {
                // updateDelDatas(availableDatas);
            }
            // console.info(JSON.stringify(datas));
        });
    });
}

// 套餐购买时长
export function syncOftenData() {
    getNowToken().then(function (token) {
        getOftenList({
            Authorization: "Bearer " + token
        }).then(function (result) {
            let datas = result.data.data;
            let availableDatas = [];
            for (let i in datas) {
                let often = entityJsondefaultHandle(datas[i]);
                // console.info(JSON.stringify(often));
                availableDatas.push(often.often_guid);
                saveOftenData(often, function () {

                });
            }
            if (availableDatas.length > 0) {
                oftenDel(availableDatas);
            }
        });
    });
}

// 套餐变更
export function syncPackData() {
    getNowToken().then(function (token) {
        getPackList({
            Authorization: "Bearer " + token
        }).then(function (result) {
            let datas = result.data.data;
            let availableDatas = [];
            for (let i in datas) {
                let pack = entityJsondefaultHandle(datas[i]);
                availableDatas.push(pack.pack_guid);
                savePackData(pack, function () {

                });
            }
            if (availableDatas.length > 0) {
                packDel(availableDatas);
            }
        });
    });
}

// 工具列表信息
export function syncToolsData() {
    getNowToken().then(function (token) {
        getToolsList({
            Authorization: "Bearer " + token
        }).then(function (result) {
            let datas = result.data.data;
            let availableDatas = [];
            for (let i in datas) {
                let tool = entityJsondefaultHandle(datas[i]);
                availableDatas.push(tool.tools_no);
                saveTools(tool, function () {
                    if (tool.tools_icon != undefined && tool.tools_icon != '') {
                        startDownloadTask(res.server.apiUrl + tool.tools_icon, tool.tools_no + "_icon.jpg");
                    }
                });
            }
            if (availableDatas.length > 0) {
                toolsDel(availableDatas);
            }
        });
    });
}

// 工具类型表同步
export function syncToolsTypeData() {
    getNowToken().then(function (token) {
        getListType({
            Authorization: "Bearer " + token
        }).then(function (result) {
            let datas = result.data.data;
            let availableDatas = [];
            for (let i in datas) {
                let toolType = entityJsondefaultHandle(datas[i]);
                availableDatas.push(toolType.tools_type_guid);
                saveToolsType(toolType, function () {});
            }
            if (availableDatas.length > 0) {
                toolsTypeDel(availableDatas);
            }
        });
    });
}

// 字典表同步
export function syncDictData() {
    getNowToken().then(function (token) {
        getDicList({
            Authorization: "Bearer " + token
        }, '').then(function (result) {
            let datas = result.data.data;
            for (let i in datas) {
                let dict = entityJsondefaultHandle(datas[i]);
                saveDict(dict, function () {

                });
            }
        });
    });
}

// 标签订阅同步
export function syncLabelData() {
    getNowToken().then(function (token) {
        getLabelList({
            Authorization: "Bearer " + token
        }).then(function (result) {
            let datas = result.data.data;
            let availableDatas = [];
            for (let i in datas) {
                availableDatas.push(datas[i].labelGuid);
                insertLabel(datas[i]);
            }
            if (availableDatas.length > 0) {
                labelDel(availableDatas);
            }
        });
    });
}

// 后端baseentity对象统一处理
function entityJsondefaultHandle(data) {
    let res = humpToUnderlineJson(data);
    delete res['data_scope'];
    delete res['params'];
    delete res['search_value'];
    delete res['remark'];
    delete res['default'];
    return res;
}