import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter)


const index = () => import('./views/index')
const Article = () => import('./views/Article')
const Articles = () => import("./views/Articles")
const AdminPanel = () => import("./views/ArticlesAdmin")
const AdminIndex = () => import("./views/IndexAdmin")
const AdminArticlesAdd = () => import("./views/AddArticlesAdmin")
const AdminUsersList = () => import("./views/UsersAdmin")
const UserProfile = () => import("./views/UserProfile")
const EditUserAdmin = () => import("./views/EditUserAdmin")
const CategoriesAdmin = () => import("./views/CategoriesAdmin")
const CreateCategory = () => import("./views/CreateCategory")
const resetPassword = () => import("./views/resetPassword")

const routes = [
    {
        path: '/',
        component: index
    },

    {
        path: '/reset-password/:token',
        component: resetPassword
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
        path: '/admin/categories',
        name: 'adminPanel.categories',
        component: CategoriesAdmin,
        meta: { middlewareAuth: true , middlewareAdmin: true}
    },

    {
        path: '/admin/categories/create',
        name: 'adminPanel.createCategory',
        component: CreateCategory,
        meta: { middlewareAuth: true , middlewareAdmin: true}
    },

    {
        path: '/admin/categories/create/:categoryId',
        name: 'adminPanel.editCategory',
        component: CreateCategory,
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
        path: '/admin/user/:userId/edit',
        name: 'adminPanel.editUser',
        component: EditUserAdmin
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
