import { authMiddleware } from "@clerk/nextjs";
 //publicRoutes: This is a property of the object. It defines an array of routes that do not 
 //require authentication. In this case,
 // the root route '/', and two API webhook routes '/api/webhooks/clerk' and '/api/webhooks/stripe' are public.
// authMiddleware: This specific middleware function from Clerk handles authentication by checking user sessions and tokens.

 export default authMiddleware({
  publicRoutes: ['/', '/api/webhooks/clerk', '/api/webhooks/stripe']
});
 
// "/((?!.+\\.[\\w]+$|_next).*)": This regex pattern matches all routes that do not end with a file extension (like .js, .css) or start with _next (Next.js internal routes).
// "/": This matches the root route.
//"/(api|trpc)(.*)": This matches any route that starts with /api or /trpc, followed by zero or more characters.
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};