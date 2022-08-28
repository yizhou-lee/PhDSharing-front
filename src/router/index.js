import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/management',
    component: Layout,
    redirect: '/management/user',
    alwaysShow: true,
    name: 'Management',
    meta: {
      title: 'Management',
      icon: 'lock',
      roles: ['admin']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/management/userManagement'),
        name: 'UserManagement',
        meta: {
          title: 'User Management',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/Files',
    component: Layout,
    redirect: '/Files/list',
    name: 'Files',
    children: [
      {
        path: 'document-list',
        component: () => import('@/views/Files/document-list'),
        name: 'DocumentList',
        meta: { title: 'Document', icon: 'list' }
      },
    ]
  },
  {
    path: '/Groups',
    component: Layout,
    redirect: '/Groups/list',
    name: 'Groups',
    children: [
      {
        path: 'list',
        component: () => import('@/views/Groups/list'),
        name: 'list',
        meta: { title: 'Groups', icon: 'peoples'}
      },
      {
        path: 'add',
        component: () => import('@/views/Groups/add'),
        hidden: true,
        name: 'AddGroup',
        meta: { title: 'Add Group' }
      },
      {
        path: 'index/:id',
        component: () => import('@/views/Groups/index'),
        redirect: {name: 'people'},
        hidden: true,
        name: 'index',
        meta: { title: 'index' },
        children: [
          {
            path: 'people',
            name: 'people',
            component: () => import('@/views/Groups/people'),
          },
          {
            path: 'people/:personId',
            name: 'peopleInfo',
            component: () => import('@/views/Groups/peopleInfo'),
          },
          {
            path: 'discussion',
            name: 'discussion',
            component: () => import('@/views/Groups/discussion'),
          },
          {
            path: 'file',
            name: 'file',
            component: () => import('@/views/Groups/file'),
          },
          {
            path: 'discussion/add',
            name: 'discussionAdd',
            component: () => import('@/views/Groups/discussionEdit'),
          },
          {
            path: 'discussionDetail/:discussionId',
            name: 'discussionDetail',
            component: () => import('@/views/Groups/discussionDetail'),
          },
          {
            path: 'discussionDetail/:discussionId/edit',
            name: 'discussionEdit',
            component: () => import('@/views/Groups/discussionEdit'),
          }
        ]
      }
    ]
  },
  {
    path: '/search',
    component: Layout,
    redirect: '/search/index',
    name: 'Search',
    children: [
      {
        path: 'index',
        component: () => import('@/views/search/index'),
        name: 'SearchIndex',
        meta: { title: 'Search', icon: 'search' }
      },
    ]
  },



  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
