import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter)


import index from './views/index';
import Article from './views/Article';
import Articles from "./views/Articles";
import AdminPanel from "./views/ArticlesAdmin";
import AdminIndex from "./views/IndexAdmin";
import AdminArticlesAdd from "./views/AddArticlesAdmin";

const routes = [
    {
        path: '/',
        component: index
    },

    {
        path: '/articles',
        name: 'Articles',
        component: Articles,
    },

    {
        path: '/category/:id',
        name: 'Category',
        component: Articles,
    },

    {
        path: '/article/:id',
        name: 'article',
        component: Article
    },


    {
        path: '/admin/',
        name: 'adminPanel.index',
        component: AdminIndex
    },

    {
        path: '/admin/articles',
        name: 'adminPanel.articles',
        component: AdminPanel
    },

    {
        path: '/admin/articles/add',
        name: 'adminPanel.articlesAdd',
        component: AdminArticlesAdd
    }
]


export default new VueRouter({
    mode: 'history',
    routes
})
