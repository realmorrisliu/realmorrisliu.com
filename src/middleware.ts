import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";
import { defineMiddleware } from "astro/middleware";

const isProtectedRoute = createRouteMatcher(["/kira(.*)"]);

const createAnonymousAuth = () =>
  ({
    userId: null,
    sessionId: null,
    getToken: async () => null,
    has: () => false,
    debug: () => {},
    redirectToSignIn: async () => {},
  }) as any;

export const onRequest = defineMiddleware((context, next) => {
  return clerkMiddleware((auth, clerkContext) => {
    const { userId, redirectToSignIn } = auth();

    if (!userId && isProtectedRoute(clerkContext.request)) {
      return redirectToSignIn();
    }
  })(context, () => {
    if (typeof context.locals.auth !== "function") {
      context.locals.auth = createAnonymousAuth;
    }

    return next();
  });
});
