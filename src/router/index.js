import Vue from 'vue'
import Router from 'vue-router'
import Feed from '../views/Feed'
import Detail from '../views/Detail'
import Register from '../views/Register'
import CollectionList from '../views/CollectionList'
import OrderList from '../views/OrderList'
import Order from '../views/Order'
import Category from '../views/Category'

Vue.use(Router);
export default new Router({
    routes: [{
        path: '/', 
        meta: {
            title: '探索号'
        }
    },{
        path: '/order',
        name: 'Order',
        component: Order,
        meta: {
            auth: false,
            title: '体验订单'
        }
    },{
        path: '/feed',
        name: 'Feed',
        component: Feed,
        meta: {
            auth: false,
            title: '发现'
        }
    }, {
        path: '/detail',
        name: 'Detail',
        component: Detail,
        meta: {
            auth: false,
            title: '详情'
        }
    },  {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            auth: false,
            title: '绑定手机号'
        }
    }, {
        path: '/collection-list',
        name: 'CollectionList',
        component: CollectionList,
        meta: {
            auth: false,
            title: '我的收藏'
        }
    }, {
        path: '/order-list',
        name: 'OrderList',
        component: OrderList,
        meta: {
            auth: false,
            title: '我的体验'
        }
    }, {
        path: '/category',
        name: 'Category',
        component: Category,
        meta: {
            auth: false,
            title: '我的体验'
        }
    }]
});