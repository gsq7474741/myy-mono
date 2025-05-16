import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 创建响应对象
    const response = NextResponse.json({
      success: true,
      message: "已成功登出"
    });
    
    // 在响应中删除cookie
    response.cookies.set({
      name: "auth",
      value: "",
      expires: new Date(0), // 立即过期
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "登出失败" },
      { status: 500 }
    );
  }
}
