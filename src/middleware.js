import { NextResponse } from 'next/server'

 
// This function can be marked `async` if using `await` inside
export  default function middleware(request) {
  const path=request.nextUrl.pathname;
  const isPublicPath =  path === '/signin' || path === '/signup' 

  

  // Handle protected routes
  const token = request.cookies.get('refreshToken')?.value || ""
  console.log("Token from cookies:", token);

  

  if(isPublicPath && token) { 
    // If the user is authenticated and trying to access a public route, redirect them to the home page
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!isPublicPath && !token) {
    // If the user is not authenticated and trying to access a protected route, redirect them to the sign-in page
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

 
export const config = {
  matcher: ['/', '/signin', '/signup',"/upload"],
}