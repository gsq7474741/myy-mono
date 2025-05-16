import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 在实际应用中，这里应该验证用户凭据，例如与数据库比对
    // 这里使用简单的硬编码验证作为示例
    if (username === "admin" && password === "password") {
      // 设置认证cookie，有效期为7天
      const response = NextResponse.json({
        success: true,
        user: {
          name: "管理员",
          email: "admin@example.com",
          avatar: "/placeholder-user.jpg",
        },
      });

      // 在响应中设置cookie
      response.cookies.set({
        name: "auth",
        value: "true",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7天
        sameSite: "strict",
      });

      return response;
    }

    // 认证失败
    return NextResponse.json(
      { success: false, message: "用户名或密码不正确" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
