import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { AUTH_TOKEN } from "@/lib/auth";

const authPages = [
  '/account', // マイページ
  '/account/edit', // 会員編集ページ
  '/account/orders', // 注文履歴一覧ページ
  '/account/password', // パスワード変更ページ
  '/account/favorites', // お気に入りページ
  '/order-confirm', // 注文確認ページ
];

// 管理者専用ページリスト
const adminPages = [
  '/admin/products', // 管理者用の商品一覧ページ
  '/admin/products/register', // 管理者用の商品登録ページ
  '/admin/inquiries', // 管理者用のお問い合わせ一覧ページ
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProcted = [...authPages, ...adminPages].some((path) =>
    pathname.startsWith(path)
  );

  if (!isProcted) return NextResponse.next();

  const token = request.cookies.get(AUTH_TOKEN)?.value;
  if (!token) {
    return redirectToLogin(request);
  }

  const user = await verifyToken(token);
  if (!user) {
    return redirectToLogin(request);
  }

  if (adminPages.some((path) => pathname.startsWith(path))) {
    if (!user.isAdmin) {
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}