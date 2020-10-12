/**
 * 软件菜单全部静态写在路由文件中
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: require('@/views/Login/Login').default
        },
        {
            path: '/',
            name: 'home',
            redirect: '/home',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'home',
                component: require('@/views/Home/Home').default
            }]
        },
        {
            path: '*',
            redirect: '/'
        }, {
            path: '/tasks',
            name: 'tasks',
            redirect: '/tasks/tasks',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'tasks',
                component: require('@/views/Tasks/Tasks').default
            }]
        }, {
            path: '/news',
            name: 'news',
            redirect: '/news/news',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'news',
                component: require('@/views/News/News').default
            }]
        }, {
            path: '/settings',
            name: 'settings',
            redirect: '/settings/settings',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'settings',
                component: require('@/views/Settings/Settings').default
            }]
        }, {
            path: '/inform',
            name: 'inform',
            redirect: '/inform/inform',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'inform',
                component: require('@/views/Notice/Inform').default
            }]
        }, {
            path: '/modal',
            name: 'modal',
            component: require('@/views/Modal/Modal').default
        }, {
            path: '/tags',
            name: 'tags',
            component: require('@/views/Modal/Tags').default
        }, {
            path: '/modalSet',
            name: 'modalSet',
            component: require('@/views/Modal/ModalSet').default
        }, {
            path: '/detail',
            name: 'detail',
            component: require('@/views/News/Detail/Detail').default
        }, {
            path: '/about',
            name: 'about',
            component: require('@/views/Modal/About/About').default
        }, {
            path: '/pwd',
            name: 'pwd',
            component: require('@/views/Modal/Pwd/Pwd').default
        }, {
            path: '/fankui',
            name: 'fankui',
            component: require('@/views/Modal/Fankui/Fankui').default
        }, {
            //资产清点
            path: '/count',
            name: 'count',
            component: require('@/views/Count/Count').default
        }, {
            //资产清点列表
            path: '/vulns',
            name: 'vulns',
            component: require('@/views/Count/Vulns/Vulns').default
        }, {
            //资产清点漏洞详情
            path: '/hole',
            name: 'hole',
            component: require('@/views/Count/Vulns/Hole/Hole').default
        }, { //A链接
            path: '/alink',
            name: 'alink',
            redirect: '/alink/alink',
            component: require('@/components/Layout/Layout').default,
            children: [{
                path: 'alink',
                component: require('@/components/A/A').default
            }]
        }, {
            path: '/update',
            name: 'update',
            component: require('@/views/Modal/Update/Update').default
        }, {
            //网站检测漏洞详情
            path: '/webVulns',
            name: 'webVulns',
            component: require('@/views/WebScan/Modal/vulnsDetail').default
        }, {
            //网站检测对比
            path: '/vulnsCompare',
            name: 'vulnsCompare',
            component: require('@/views/WebScan/Modal/vulnsCompare').default
        },
        //网站监测
        {
            path: '/webscan',
            name: 'webscan',
            component: require('@/views/WebScan/WebScan').default,
            redirect: '/webDetail',
            children: [{
                    path: 'Table',
                    name: 'Table',
                    component: require('@/views/WebScan/Table').default
                },
                {
                    path: '/webDetail',
                    name: 'webDetail',
                    component: require('@/views/WebScan/Table').default
                },
                {
                    path: 'FirstPage',
                    name: 'FirstPage',
                    component: require('@/views/WebScan/FirstPage').default
                }, {
                    path: 'Detail/:id',
                    name: 'Detail',
                    component: require('@/views/WebScan/Detail').default
                }
            ]
        }, {
            //任务详情
            path: '/Assets',
            name: 'Assets',
            component: require('@/views/Tasks/Dialog/Assets').default
        }
    ]
})