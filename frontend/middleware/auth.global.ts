import type { RouteLocation, RouteLocationNormalized, RouteLocationNormalizedGeneric } from "vue-router";

export default defineNuxtRouteMiddleware((to, from) => {
  const publicRoutes = ['/signin', '/signup'];
  const isPublicRoute = publicRoutes.includes(to.path);

  if (import.meta.server) {
    // handleServerSide(to, isPublicRoute);
  } else {
    return handleClientSide(isPublicRoute);
  }
});

const handleServerSide = (to: RouteLocationNormalizedGeneric, isPublicRoute: boolean) => {
  const authorization = to.params
  if (!authorization) {
    console.log('No authorization header on server side, redirecting to /signin');
    return navigateTo('/signin');
  }
  if (isPublicRoute && authorization) {
    console.log('Authorization header found on server side, redirecting to /');
    return navigateTo('/');
  }
};

const handleClientSide = (isPublicRoute: boolean) => {
  const accessToken = localStorage.getItem('access_token');

  if (!isPublicRoute && !accessToken) {
    console.log('No access token on client side, redirecting to /signin');
    return navigateTo('/signin');
  }

  if (isPublicRoute && accessToken) {
    console.log('Access token found on client side, redirecting to /');
    return navigateTo('/');
  }
  console.log('No need to redirect on client side');
};
