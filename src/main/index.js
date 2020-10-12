import {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    shell,
    Tray,
    Notification,
    dialog,
    crashReporter
} from 'electron'
var fs = require("fs-extra");

//引入自动更新模块
const {
    autoUpdater
} = require('electron-updater');

const path = require('path');


import pkg from '../../package.json'

// 引入自动启动模块
const startOnBoot = require('./startOnBoot.js')


// 崩溃报告
import * as Sentry from '@sentry/electron'

//初始化数据库
import initDB from '../utils/initDB'
// 引入任务定时器
import job from '../api/job'

//初始化数据方法
import {
    initData,
    downloadFile,
    unzipAndSavestatus
} from '../utils/initData'

import {
    scanAll,
    scanByParameter
} from '../api/device/nmap'

import {
    scanZichan
} from '../utils/toolsDownload'

import mqttListener from '../api/mqttListener'

//引入下载文件
import download from '../utils/func/download'

//引入打开本地文件方法
import openFile from '../utils/func/openFile'

//引入自动下载zip文件方法
import {
    nmapPath,
    toolsPath,
} from '../utils/func/zip'
import resources from '../../resources.json'


//初始化数据方法
import {
    createAWindow
} from '../utils/createWindow'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 * process.env.NODE_ENV 在package.json中设置
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
//监测离线在线状态
let onlineStatusWindow;
export let mainWindow, countWindow, loginWindow, modalWindow, setModalWindow, newsWindow, aboutWindow, pwdWindow, fankuiWindow,
    vulnWindow, vulnDetailWindow, aWindow, updateWindow, webScanWindow, webVulnsWindow, vulnsCompareWindow, AssetsWindow;
//主进程url
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`
// 登录url
const loginURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#login` :
    `file://${__dirname}/index.html#login`
// 账户设置url
const modalURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#modal` :
    `file://${__dirname}/index.html#modal`
// 系统设置url
const setModalURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#modalSet` :
    `file://${__dirname}/index.html#modalSet`
// 新闻详情url
const newsURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#detail` :
    `file://${__dirname}/index.html#detail`
// 关于我们url
const aboutURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#about` :
    `file://${__dirname}/index.html#about`
//修改密码
const pwdURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#pwd` :
    `file://${__dirname}/index.html#pwd`
//反馈
const fankuiURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#fankui` :
    `file://${__dirname}/index.html#fankui`

//资产清点
const countURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#count` :
    `file://${__dirname}/index.html#count`

//资产清点列表
const vulnURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#vulns` :
    `file://${__dirname}/index.html#vulns`
//资产清点详情
const vulnDetailURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#hole` :
    `file://${__dirname}/index.html#hole`
//a链接详情
const aURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#alink` :
    `file://${__dirname}/index.html#alink`;
//自动更新详情
const updateURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#update` :
    `file://${__dirname}/index.html#update`;

//网站检测
const webScanURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#webscan` :
    `file://${__dirname}/index.html#webscan`;
//网站检测漏洞
const webVulnsURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#webVulns` :
    `file://${__dirname}/index.html#webVulns`;

const vulnsCompareURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#vulnsCompare` :
    `file://${__dirname}/index.html#vulnsCompare`;

const AssetsURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080/#Assets` :
    `file://${__dirname}/index.html#Assets`;

const ApplicationName = pkg.name
// 托盘对象
let appTray = null
// 是否可以退出
let trayClose = false
// 系统托盘右键菜单
let trayMenuTemplate
// 系统托盘图标
let iconPath
// 图标的上上下文
let contextMenu
// 图标闪烁定时器
let flashTrayTimer
// 单一实例
const gotTheLock = app.requestSingleInstanceLock();



if (process.platform === 'win32') {
    app.setAppUserModelId(ApplicationName)
}

/**
 * 创建登录窗口
 * 1. 创建登录窗口
 * 2. 绑定openMainWindow通道【销毁loginwindow ,打开mainwindow】
 * 3. 绑定openLoginWindow通道【销毁mainwindow,打开loginwindow】
 */
function createLoginWindow() {
    if (loginWindow) {
        loginWindow.destroy();
        loginWindow = null
    }

    if (!loginWindow) {
        /**
         * Initial window options
         */
        loginWindow = new BrowserWindow({
            icon: `${__static}/logo.png`,
            show: true,
            height: 410,
            width: 310,
            maxHeight: 410,
            maxWidth: 310,
            useContentSize: true,
            frame: false, // 无边框
            transparent: true, // 透明
            // fullscreen: true, // 全屏,
            resizable: false,
            maximizable: false,
            minimizable: false,
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false
            },
        })
        loginWindow.loadURL(loginURL);
    }


    /**
     * 打开主窗口的调试工具
     */

    // 为了防止闪烁，让画面准备好了再显示
    // 对于一个复杂的应用，ready-to-show 可能发出的太晚，会让应用感觉缓慢。 在这种情况下，建议立刻显示窗口，并使用接近应用程序背景的 backgroundColor
    // 请注意，即使是使用 ready-to-show 事件的应用程序，仍建议使用设置 backgroundColor 使应用程序感觉更原生。
    loginWindow.once('ready-to-show', () => {
        loginWindow.show()
    })

    loginWindow.on('closed', () => {
        loginWindow = null
    })
    loginWindow.show()
    loginWindow.focus();

    loginWindow.on('close', (event) => {

    })


    /**
     * 绑定通道openMainWindow方法供render进程调用
     */
    ipcMain.on('openMainWindow', (event, arg) => {
        if (!mainWindow) {
            createMainWindow(arg)
        }
        // loginWindow.hide()
        loginWindow.destroy()
        mainWindow.show()
        mainWindow.focus()
    })

    ipcMain.on('openLoginWindow', () => {
        if (!loginWindow) {
            createLoginWindow()
        }
        loginWindow.show()
        loginWindow.focus()
    })
}

/**
 * 创建主窗口
 */
function createMainWindow(arg) {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        icon: `${__static}/logo.png`,
        show: true,
        height: 600,
        width: 1020,
        maxHeight: 600,
        maxWidth: 1020,
        useContentSize: true,
        frame: false, // 无边框
        transparent: true, // 透明
        // fullscreen: true, // 全屏,
        resizable: false,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
    })
    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    /**
     * 打开主窗口的调试工具
     */

    // mainWindow.webContents.openDevTools();
    /**
     * 监听
     */

    // mainWindow.on('close', (event) => {
    //     if (process.platform === 'win32') {
    //         if (!trayClose) {
    //             // 最小化
    //             mainWindow.hide()
    //             event.preventDefault()
    //         }
    //     }
    // })



    // 开始
    initData();

    // //nmap监听方法
    ipcMain.on('scanIP', (event, obj) => {
        var taskinfo = {
            tools_no: resources.tools.zcqd,
            task_guid: obj.task_guid,
            start_time: new Date().getTime()
        }
        // scanAll(taskinfo);
        scanByParameter(taskinfo, obj.ipstart, obj.ipend)
    })

    //资产清算下载
    ipcMain.on('scanZichan', (event, url) => {
        scanZichan(url);
    })
    /**
     * 绑定通道openModalWindow方法供render进程调用模态框__账户设置
     */
    ipcMain.on('openModalWindow', (event, arg) => {
        modalWindow = createAWindow(modalWindow, 670, 610, modalURL);
        modalWindow.on('closed', () => {
            modalWindow = null
        })
    })

    /**
     * 绑定通道openSetModalWindow方法供render进程调用模态框__系统设置
     */
    ipcMain.on('openSetModalWindow', (event, arg) => {
        setModalWindow = createAWindow(setModalWindow, 670, 610, setModalURL);
        setModalWindow.on('closed', () => {
            setModalWindow = null
        })
    })



    /**
     * 绑定通道openPwdWindow方法供render进程调用更改密码新窗口
     */
    ipcMain.on('openPwdWindow', (event, arg) => {
        pwdWindow = createAWindow(pwdWindow, 518, 393, pwdURL);
        pwdWindow.on('closed', () => {
            pwdWindow = null
        })
    })

    /**
     * 绑定通道openFankuiWindow方法供render进程调用反馈新窗口
     */
    ipcMain.on('openFankuiWindow', (event, arg) => {
        fankuiWindow = createAWindow(fankuiWindow, 670, 610, fankuiURL);
        fankuiWindow.on('closed', () => {
            fankuiWindow = null
        })
    })

    /**
     * 绑定通道openModalWindow方法供render进程调用新闻详情新窗口
     */
    ipcMain.on('openAboutWindow', (event, arg) => {
        aboutWindow = createAWindow(aboutWindow, 346, 310, aboutURL);
        aboutWindow.on('closed', () => {
            aboutWindow = null
        })
    })

    /**
     * 绑定通道openNewsWindow方法供render进程调用新闻详情新窗口
     */
    ipcMain.on('openNewsWindow', (event, arg) => {
        newsWindow = createAWindow(newsWindow, 670, 610, newsURL, true);
        newsWindow.on('closed', () => {
            newsWindow = null
        })
    })

    /**
     * 绑定通道openFankuiWindow方法供render进程调用反馈新窗口
     */
    ipcMain.on('openCountWindow', (event, arg) => {
        countWindow = createAWindow(countWindow, 1020, 610, countURL, true);
        countWindow.on('closed', () => {
            countWindow = null
        })

    })

    /**
     * 绑定通道openModalWindow方法供render进程调用新闻详情新窗口
     */
    ipcMain.on('openVulnsWindow', (event, arg) => {
        vulnWindow = createAWindow(vulnWindow, 780, 610, vulnURL, true);
        vulnWindow.on('closed', () => {
            vulnWindow = null
        })
    })


    /**
     * 绑定通道openModalWindow方法供render进程调用新闻详情新窗口
     */
    ipcMain.on('openVulnsDetailWindow', (event, arg) => {
        vulnDetailWindow = createAWindow(vulnDetailWindow, 1000, 610, vulnDetailURL, true);
        vulnDetailWindow.on('closed', () => {
            vulnDetailWindow = null
        })
    })




    /**
     * 绑定通道openModalWindow方法供render进程调用新闻详情新窗口
     */
    ipcMain.on('openUpdateWindow', (event, arg) => {
        let height = 460;
        if (arg == 1) height = 430;
        updateWindow = createAWindow(updateWindow, 370, height, updateURL);
        // updateWindow.webContents.openDevTools();
        mainWindow.webContents.send('openUpdate', arg);
        updateWindow.on('closed', () => {
            updateWindow = null
        })
    })



    /**
     * 绑定通道openWebScanWindow方法供render进程调用网站监测新窗口
     */
    ipcMain.on('openWebScanWindow', (event, arg) => {
        webScanWindow = createAWindow(webScanWindow, 1000, 610, webScanURL, true);
        webScanWindow.on('closed', () => {
            webScanWindow = null
        })
        // webScanWindow.webContents.openDevTools();
    })


    /**
     * 绑定通道openWebVulnWindow方法供render进程调用网站监测新窗口
     */
    ipcMain.on('openWebVulnWindow', (event, arg) => {
        webVulnsWindow = createAWindow(webVulnsWindow, 670, 610, webVulnsURL, true);
        webVulnsWindow.on('closed', () => {
            webVulnsWindow = null
        })
        // webVulnsWindow.webContents.openDevTools();
    })

    ipcMain.on('openAssetsWindow', (event, arg) => {
        AssetsWindow = createAWindow(AssetsWindow, 1000, 610, AssetsURL, true);
        AssetsWindow.on('closed', () => {
            AssetsWindow = null
        })
        //  AssetsWindow.webContents.openDevTools();
        // webVulnsWindow.webContents.openDevTools();
    })



    /**
     * 绑定通道openVulnsCompare方法供render进程调用网站监测新窗口
     */
    ipcMain.on('openVulnsCompare', (event, arg) => {
        vulnsCompareWindow = createAWindow(vulnsCompareWindow, 770, 610, vulnsCompareURL, true);
        vulnsCompareWindow.on('closed', () => {
            vulnsCompareWindow = null
        })
        // vulnsCompareWindow.webContents.openDevTools();
    })

    if (arg == "init") {
        setTimeout(function () {
            mainWindow.webContents.send('getVersion');
        }, 3000)
    }

    ipcMain.on('closeUpdateWindow', (event, arg) => {
        mainWindow.webContents.send('openUpdate', "close");
    })

    ipcMain.on('reopenMainWindow', () => {
        mainWindow.webContents.reload();
    })


    ipcMain.on('quit', () => {
        app.quit();
    })

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        // toolsPath—————— \AppData\Roaming\Electron\tools
        const filePath = path.join(toolsPath + global.sharedObject.savePath, item.getFilename());
        item.setSavePath(filePath);
        item.on('updated', (event, state) => {
            let total;

            if (state === 'progressing') {
                if (item.isPaused()) {
                    total = "stop";
                } else {
                    total = (item.getReceivedBytes() / item.getTotalBytes() * 100).toFixed(2);
                }
            } else if (state === 'interrupted') {
                total = "stop";
            }
            sendUpdateHome("下载调度引擎", {
                item: item.getFilename(),
                total: total
            });
            mainWindow.webContents.send('download-process', {
                item: item.getFilename(),
                total: total
            });
        });

        //下载完成后解压到对应文件夹中
        item.once('done', (event, state) => {
            var tips = "";
            if (state === 'completed') {
                tips = "completed";

                unzipAndSavestatus(toolsPath + global.sharedObject.savePath, item.getFilename(), global.sharedObject.download_tools_guid, function () {
                    console.log("重新执行")
                    reloadApp();
                })
            } else if (state == "cancelled") {
                tips = "cancelled";
            }
            mainWindow.webContents.send('download-process-success', {
                item: item.getFilename(),
                tips: tips
            });
        })
    })
    //默认下载调度引擎
    downloadFile(resources.tools.ToolManage).then(res => {
        if (res.is_download) {
            sendUpdateHome("startdownload", res);
            downloadZip(res.url, res.savePath, res.download_tools_guid)
        }
    })

    ipcMain.on('downloadFile', (event, obj) => {
        downloadZip(obj.url, obj.savePath, obj.tools_guid)
    })

    ipcMain.on('reloadApp', (event) => {
        app.relaunch();
        app.exit(0);
        // reloadWindow(mainWindow);
    })

}

function reloadApp() {
    console.log("执行reloadApp")
    app.relaunch();
    app.exit(0);
}

// 主进程主动发送消息给渲染进程函数
function sendUpdateHome(message, data) {
    console.log({
        message,
        data
    });
    mainWindow.webContents.send('sendUpdateHome', {
        message,
        data
    });
}

export function downloadZip(url, savePath, download_tools_guid) {
    mainWindow.webContents.downloadURL(url);
    global.sharedObject.savePath = savePath;
    global.sharedObject.download_tools_guid = download_tools_guid;
}
/**
 * 设置系统托盘
 */
function createTray() {
    // 是否可以退出
    trayClose = false

    // 系统托盘图标
    iconPath = `${__static}/logoNotWin.png`;

    let iconMessagePath = `${__static}/iconMessageNotWin.png`
    let iconTransparentPath = `${__static}/iconTransparentNotWin.png`
    // 通知图标
    const iconNoticePath = `${__static}/logo.png`

    if (process.platform === 'win32') {
        iconPath = `${__static}/logo.ico`
        iconMessagePath = `${__static}/iconMessage.ico`
        iconTransparentPath = `${__static}/iconTransparent.ico`
    }

    // 系统托盘右键菜单
    trayMenuTemplate = [
        // {
        //     label: '崩溃报告测试 process.crash()',
        //     click: function () {
        //         console.log('process.crash()')
        //         process.crash()
        //     }
        // },
        // {
        //     label: '崩溃报告测试throw new Error',
        //     click: function () {
        //         console.log('Error test in main progress')
        //         throw new Error('Error test in main progress')
        //     }
        // },
        // {
        //     label: '托盘闪烁111',
        //     click: function () {
        //         // 判断如果上一个定时器是否执行完
        //         if (flashTrayTimer) {
        //             return
        //         }

        //         // 任务栏闪烁
        //         // if (!mainWindow.isFocused()) {
        //         //     mainWindow.showInactive();
        //         //     mainWindow.flashFrame(true);
        //         // }

        //         //系统托盘图标闪烁
        //         appTray.setImage(iconMessagePath)
        //         let count = 0;
        //         flashTrayTimer = setInterval(function () {
        //             count++;
        //             if (count % 2 == 0) {
        //                 appTray.setImage(iconTransparentPath)
        //             } else {
        //                 appTray.setImage(iconMessagePath)
        //             }
        //         }, 600);
        //     }
        // },
        // {
        //     label: '弹出通知',
        //     click: function () {
        //         console.log(Notification.isSupported())
        //         let notification = new Notification({
        //             title: '通知的标题', // 通知的标题, 将在通知窗口的顶部显示
        //             body: '通知的正文文本', // 通知的正文文本, 将显示在标题或副标题下面
        //             icon: iconNoticePath, // 用于在该通知上显示的图标
        //             silent: true, // 在显示通知时是否发出系统提示音
        //         })

        //         notification.show()
        //         notification.on('click', () => {
        //             notification.close()
        //             console.log('click notification')
        //         })
        //     }
        // },
        {
            label: '打开',
            click: function () {
                mainWindow.show()
            }
        },
        {
            label: '退出',
            click: function () {
                // 退出
                trayClose = true
                app.quit()
            }
        }
    ]

    appTray = new Tray(iconPath)
    // 图标的上上下文
    contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    // 设置此托盘图标的悬停提示内容
    appTray.setToolTip(ApplicationName + "托盘")
    // 设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu)
    // 主窗口显示隐藏切换
    appTray.on('click', () => {
        // 清楚图标闪烁定时器
        clearInterval(flashTrayTimer)
        flashTrayTimer = null
        // 还原图标
        appTray.setImage(iconPath)
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
}

/**
 * 开机启动，注册方法供界面使用
 */
function ipcStartOnBoot() {
    // 检查是否自动启动发送给设置页面展示
    // 
    ipcMain.on('getAutoStartValue', () => {
        startOnBoot.getAutoStartValue(ApplicationName, (error, result) => {
            if (error) {
                mainWindow.webContents.send('getAutoStartValue', false)
            } else {
                mainWindow.webContents.send('getAutoStartValue', true)
            }
        })
    })

    // 设置开机自动启动
    ipcMain.on('enableAutoStart', () => {
        startOnBoot.enableAutoStart(ApplicationName, process.execPath)
    })

    // 取消开机自动启动
    ipcMain.on('disableAutoStart', () => {
        startOnBoot.disableAutoStart(ApplicationName)
    })
}

ipcMain.on('openDirectoryDialog', function (event, p) {
    dialog.showOpenDialog({
        properties: [p]
    }, function (files) {
        if (files) { //如果有选中
            //发送选择的对象给子进程
            event.sender.send('selectedDirItem', files[0])
        }
    })
});

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
    checkForUpdates(arg);
});
/**
 * 自动更新
 */
let checkForUpdates = (feedUrl) => {
    // 更新前，删除本地安装包
    let updaterCacheDirName = 'client-updater'
    const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updaterCacheDirName, 'pending')
    fs.emptyDir(updatePendingPath)

    //开发环境配置
    if (process.env.NODE_ENV === 'development') {
        // mac的地址是'Contents/Resources/app-update.yml'
        var autoPath = require('path').join(__dirname, "../../build/win-unpacked/resources/app-update.yml");
        autoUpdater.updateConfigPath = autoPath;
        // autoUpdater.updateConfigPath ="\\client-gree\\build\\win-unpacked\\resources"
    }
    autoUpdater.currentVersion = pkg.version;
    // 配置安装包远端服务器
    autoUpdater.setFeedURL(feedUrl);
    // 下面是自动更新的整个生命周期所发生的事件
    autoUpdater.on('error', function (message) {
        sendUpdateMessage('error', message.toString());
    });
    //更新版本对比
    autoUpdater.on('checking-for-update', function (message) {
        sendUpdateMessage('checking-for-update', message);
    });
    //更新包获取
    autoUpdater.on('update-available', function (message) {
        sendUpdateMessage('update-available', message);
    });
    //更新包获取失败
    autoUpdater.on('update-not-available', function (message) {
        sendUpdateMessage('update-not-available', message);
        ipcMain.removeListener('update', function (e, arg) {})
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        sendUpdateMessage('downloadProgress', progressObj);
    });
    // 更新下载完成事件
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        sendUpdateMessage('isUpdateNow');
        ipcMain.removeListener('update', function (e, arg) {})
        // 监听到用户的更新操作之后，自动退出重新安装
        ipcMain.on('updateNow', (e, arg) => {
            autoUpdater.quitAndInstall();
        });
    });

    //执行自动更新检查
    autoUpdater.checkForUpdates();
};
// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
    console.log({
        message,
        data
    });
    updateWindow.webContents.send('message', {
        message,
        data
    });
}


/**
 * 崩溃报告
 * Sentry 是一个开源的实时错误追踪系统
 */
function crashReport() {
    // 报告常规错误
    Sentry.init({
        dsn: 'https://b272780a16674a4599a9daf9eb4e8186@sentry.io/5184457',
    })

    // 报告系统错误【electron】
    crashReporter.start({
        companyName: 'gree',
        productName: 'client_porject',
        ignoreSystemCrashHandler: true,
        submitURL: 'https://sentry.io/api/5184457/minidump/?sentry_key=b272780a16674a4599a9daf9eb4e8186'
    })

    // 渲染进程崩溃事件
    mainWindow.webContents.on('crashed', () => {
        const options = {
            type: 'error',
            title: '进程崩溃了',
            message: '这个进程已经崩溃.',
            buttons: ['重载', '退出'],
        };
        recordCrash().then(() => {
            dialog.showMessageBox(options, (index) => {
                if (index === 0) {
                    reloadWindow(mainWindow);
                } else {
                    app.quit()
                }
            });
        }).catch((e) => {
            console.log('err', e)
        });
    })

    function recordCrash() {
        return new Promise(resolve => {
            // 崩溃日志请求成功....
            resolve();
        })
    }


}

function reloadWindow(mainWin) {
    if (mainWin.isDestroyed()) {
        app.relaunch();
        app.exit(0);
    } else {
        BrowserWindow.getAllWindows().forEach((w) => {
            if (w.id !== mainWin.id) {
                w.destroy()
            }
        });
        mainWin.reload();
    }
}

/**
 * 协议处理
 * 暂时不知道用途
 */
function protocalHandler() {
    const args = [];
    if (!app.isPackaged) {
        // 如果是开发阶段，需要把我们的脚本的绝对路径加入参数中
        args.push(path.resolve(process.argv[1]))
    }
    // 加一个 `--` 以确保后面的参数不被 Electron 处理
    args.push('--')

    // 注册协议
    const PROTOCOL = pkg.name
    app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, args)

    // 如果打开协议时，没有其他实例，则当前实例当做主实例，处理参数
    handleArgv(process.argv)

    // 其他实例启动时，主实例会通过 second-instance 事件接收其他实例的启动参数 `argv`
    app.on('second-instance', (event, argv) => {
        // Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
        if (process.platform === 'win32') {
            handleArgv(argv)
        }
    })

    // macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
    app.on('open-url', (event, urlStr) => {
        handleUrl(urlStr)
    })

    // 处理参数
    function handleArgv(argv) {
        const prefix = `${PROTOCOL}:`;
        // 开发阶段，跳过前两个参数（`electron.exe .`）
        // 打包后，跳过第一个参数（`myapp.exe`）
        const offset = app.isPackaged ? 1 : 2
        const url = argv.find((arg, i) => i >= offset && arg.startsWith(prefix))
        if (url) handleUrl(url)
    }

    // 解析Url
    function handleUrl(urlStr) {
        // myapp:?a=1&b=2
        const urlObj = new URL(urlStr);
        const {
            searchParams
        } = urlObj;
        console.log(urlObj.query); // -> a=1&b=2
        console.log(searchParams.get('a')); // -> 1
        console.log(searchParams.get('b')); // -> 2
        // 根据需要做其他事情
    }

}


/**
 * 单一实例
 * 系统入口
 */
if (!gotTheLock) {
    app.quit()
} else {
    // app.on('second-instance', (event, commandLine, workingDirectory) => {
    //     // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    //     // if (mainWindow) {
    //     //     if (mainWindow.isMinimized()) mainWindow.restore()
    //     //     mainWindow.focus()
    //     // }
    //     if (loginWindow) {
    //         loginWindow.focus()
    //     }
    // })

    // 创建 mainWindow, 加载应用的其余部分, etc...
    app.on('ready', () => {

        createLoginWindow();
        createTray();
        ipcStartOnBoot();
        crashReport();
        // createMainWindow()
        // protocalHandler() //不知道用途，暂时注释掉
    })
}


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (loginWindow === null) {
        createLoginWindow();
    }
})

// app.whenReady().then(() => {
//     onlineStatusWindow = new BrowserWindow({
//         width: 0,
//         height: 0,
//         show: false
//     })
//     onlineStatusWindow.loadURL(`file://${__dirname}/index.html`)
// })



//定义网页间共享数据
global.sharedObject = {
    //新闻详情id
    newsId: '',
    device_id: "",
    //标签
    tags: [],
    //通知通报
    notice_guid: "",
    //漏洞详情
    vuln_id: '',
    tools_id: '',
    webscan: {},
    compare: {},
    savePath: "",
    download_tools_guid: "",
    task_assets_guid: "",
    download_tools_url: ""
}