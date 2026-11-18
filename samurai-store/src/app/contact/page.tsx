"use client";

import ContactForm from "@/components/ContactForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserContactPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();// デフォルトの送信動作をキャンセル
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;


    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      setErrorMessage("すべての項目を入力してください。");
      return;
    }

    try {// 会員送信APIにPOSTリクエストを送信
      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {// 送信成功時はトップページへ遷移
        router.push("/?submitted=1");// 送信成功をクエリパラメータで通知
      } else {// 送信失敗時はエラー情報を表示
        const data = await res.json();
        setErrorMessage(data.message || "送信に失敗しました。");
      }
    } catch (error) {
      setErrorMessage("通信エラーが発生しました。");
    }
  };
  return (
    <main className="max-w-md mx-auto py-10">
      <Link href="/">
        トップページへ戻る
      </Link>
      <h1 className="text-center mb-4">問い合わせページ</h1>
      {errorMessage && (
        <p className="text-red-600 text-center mt-8">{errorMessage}</p>
      )}
      <ContactForm
        onSubmit={handleSubmit}
        submitLabel="送信"
      />
    </main>
  );
}