// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        meta: { title: '首页', keepAlive: true, icon: bxAnaalyse, permission: ['dasnboard'] },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '系统分析', keepAlive: false, permission: ['dasnboard'] }
          },
        ]
      },

      // user
      {
        path: '/users',
        name: 'users',
        component: PageView,
        redirect: '/users/userInfo',
        meta: { title: '用户管理', icon: 'user', permission: ['users'] },
        children: [
          {
            path: '/users/userInfo/:pageNo([1-9]\\d*)?',
            name: 'UserInfo',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/users/UserInfo'),
            meta: { title: '用户信息', keepAlive: true, permission: ['users'] }
          }
        ]
      },

      // role
      {
        path: '/roles',
        name: 'roles',
        component: PageView,
        redirect: '/roles/roleInfo',
        meta: { title: '角色管理', icon: 'team', permission: ['roles'] },
        children: [
          {
            path: '/roles/roleInfo/:pageNo([1-9]\\d*)?',
            name: 'RoleInfo',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/roles/RoleInfo'),
            meta: { title: '角色信息', keepAlive: true, permission: ['roles'] }
          }
        ]
      },

      // component
      {
        path: '/component',
        name: 'component',
        component: PageView,
        redirect: '/component/classifyInfo',
        meta: { title: '组件管理', icon: 'slack', permission: ['component'] },
        children: [
          {
            path: '/component/classifyInfo/:pageNo([1-9]\\d*)?',
            name: 'ClassifyInfo',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/component/ClassifyInfo'),
            meta: { title: '分类信息', keepAlive: true, permission: ['component'] }
          },
          {
            path: '/component/componentAudit/:pageNo([1-9]\\d*)?',
            name: 'ComponentAudit',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/component/ComponentAudit'),
            meta: { title: '组件审核', keepAlive: true, permission: ['component'] }
          }
        ]
      },
      //组件下载
      {
        path: '/com',
        name: 'com',
        component: PageView,
        redirect: '/com/componentList',
        meta: { title: '组件下载', icon: 'form', permission: ['com'] },
        children: [
          {
            path: '/com/componentList/:pageNo([1-9]\\d*)?',
            name: 'ComponentList',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/com/ComponentList'),
            meta: { title: '组件下载', keepAlive: true, permission: ['com'] }
          }
        ]
      },

      // log
      {
        path: '/log',
        name: 'log',
        component: PageView,
        redirect: '/log/logInfo',
        meta: { title: '日志管理', icon: 'form', permission: ['log'] },
        children: [
          {
            path: '/log/logInfo/:pageNo([1-9]\\d*)?',
            name: 'LogInfo',
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/log/LogInfo'),
            meta: { title: '日志信息', keepAlive: true, permission: ['log'] }
          }
        ]
      },

      // userCenter
      {
        path: '/userCenter',
        name: 'userCenter',
        component: PageView,
        redirect: '/userCenter/center',
        meta: { title: '个人中心', icon: 'user', keepAlive: true, permission: ['userCenter'] },
        children: [
          {
            path: '/userCenter/center/:pageNo([1-9]\\d*)?',
            name: 'Center',
            hideChildrenInMenu: true,
            component: () => import('@/views/userCenter/Center'),
            meta: { title: '我的组件', keepAlive: true, permission: ['userCenter'] }
          }
        ]
      },
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]