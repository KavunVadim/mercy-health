import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { verifyToken } from "@/lib/auth/jwt";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  const start = Date.now();

  function logResponse(response: NextResponse) {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      level: 'info',
      message: `${method} ${pathname}`,
      method,
      path: pathname,
      status: response.status,
      duration,
      ts: new Date().toISOString(),
    }));
    return response;
  }

  // Locale detection — redirect missing locale to default
  if (
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/admin") &&
    !pathname.includes(".")
  ) {
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
    );

    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);
      return logResponse(NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url),
      ));
    }
  }

  // Auth protection for admin routes
  if (pathname.startsWith("/api/auth")) {
    return logResponse(NextResponse.next());
  }

  if (pathname === "/admin/login" || pathname.endsWith("/admin/login")) {
    return logResponse(NextResponse.next());
  }

  const token = request.cookies.get("accessToken")?.value;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return logResponse(NextResponse.redirect(loginUrl));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return logResponse(NextResponse.redirect(loginUrl));
    }

    const response = NextResponse.next();
    response.headers.set("x-admin-id", payload.sub);
    return logResponse(response);
  }

  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return logResponse(new NextResponse("Unauthorized", { status: 401 }));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return logResponse(new NextResponse("Unauthorized", { status: 401 }));
    }

    return logResponse(NextResponse.next());
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
