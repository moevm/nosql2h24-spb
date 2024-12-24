export default function ({app}) {
    app.router.beforeEach((to, from, next) => {
        const isPublicRoute = to.fullPath === '/signin' || to.fullPath === '/signup';
        if (!isPublicRoute && !localStorage.getItem('access_token')) {
            return next({path: '/signin'});
        }
        if (isPublicRoute && localStorage.getItem('access_token')) {
            return next({path: '/'});
        }
        next();
    })
    
}


