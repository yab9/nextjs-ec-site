import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string | null;
  created_at	?: string;
};

export async function GET(request: NextRequest) {
  try {
    const inquiries = await executeQuery<Contact>(
      "SELECT *  FROM inquiries"
    );

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("問い合わせAPIエラー：", error);
    return NextResponse.json({ message: "サーバーエラーが発生しました。" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ message: "すべての項目を入力してください。" }, { status: 400 });
    }

    const emailPattern = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ message: "正しいメールアドレスの形式で入力してください。" }, { status: 400 });
    }

    await executeQuery(`
      INSERT INTO inquiries (name, email,message)
      VALUES (?, ?, ?);
      `, [name, email, message]
    );
    return NextResponse.json({ message: "お問い合わせを送信しました。ご返信までしばらくお待ちください。" });
  } catch (error) {
    console.error("問い合わせ送信エラー", error);
    return NextResponse.json({ message: "サーバーエラーが発生しました。" }, { status: 500 })
  }
}