import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter)


import index from './views/index';
import Article from './views/Article';
import Articles from "./views/Articles";
import AdminPanel from "./views/ArticlesAdmin";
import AdminIndex from "./views/IndexAdmin";
import AdminArticlesAdd from "./views/AddArticlesAdmin";
import AdminUsersList from "./views/UsersAdmin";
import UserProfile from "./views/UserProfile";

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
        component: Articles
    },

    {
        path: '/article/:id',
        name: 'article',
        component: Article
    },


    {
        path: '/admin',
        name: 'adminPanel.index',
        component: AdminIndex,
        meta: { middlewareAuth: true , middlewareAdmin: true}
    },

    {
        path: '/admin/articles',
        name: 'adminPanel.articles',
        component: AdminPanel,
        meta: { middlewareAuth: true , middlewareAdmin: true}
    },

    {
        path: '/admin/articles/add',
        name: 'adminPanel.articlesAdd',
        component: AdminArticlesAdd,
        meta: { middlewareAuth: true , middlewareAdmin: true}
    },

    {
        path: '/admin/article/edit/:articleId',
        name: 'adminPanel.editArticle',
        component: AdminArticlesAdd,
        meta: { middlewareAuth: true , middlewareAdmin: true}
    },

    {
        path: '/admin/users',
        name: 'adminPanel.users',
        component: AdminUsersList,
        meta: { middlewareAuth: true , middlewareAdmin: true}
    },

    {
        path: '/user/:userId',
        name: 'user.profile',
        component: UserProfile
    }
]


const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.middlewareAuth)){
        if (!auth.check()) {
            next({
                path: '/',
                query: { redirect: to.fullPath }
            });
            return;
        }
    }
    if (to.matched.some(record => record.meta.middlewareAdmin)){
        if (!auth.check()) {
            next({
                path: '/',
                query: { redirect: to.fullPath }
            });
            return;
        }
        if(!auth.user.admin){
            next({
                path: '/',
                query: { redirect: to.fullPath }
            });
            return;
        }
    }
    next();
})

export default router;
