import { clerkMiddleware } from "@clerk/astro/server";
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware((context, next) => {
  return clerkMiddleware()(context, () => {
    if (typeof context.locals.auth !== "function") {
      context.locals.auth = () =>
        ({
          userId: null,
          sessionId: null,
          getToken: async () => null,
          has: () => false,
          debug: () => {},
          redirectToSignIn: async () => {},
        }) as any;
    }
    return next();
  });
});