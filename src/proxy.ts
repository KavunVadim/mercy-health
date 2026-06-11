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
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url),
      );
    }
  }

  // Auth protection for admin routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname.endsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("accessToken")?.value;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    const response = NextResponse.next();
    response.headers.set("x-admin-id", payload.sub);
    return response;
  }

  if (pathname.startsWith("/api/admin")) {
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
