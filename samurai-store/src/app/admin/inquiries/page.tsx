import Link from "next/link"

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string | null;
  created_at	?: string;
};

export default async function AdminContactPage() {

  const res = await fetch(`${process.env.BASE_URL}/api/inquiries`, {
    cache: "no-store"
  });

  // APIから返されたデータを取得
  const  contacts : Contact[] = await res.json()
  if (!Array.isArray(contacts)) {
    console.error("問い合わせデータの取得に失敗しました。");
    return <p className="text-center text-gray-500 text-lg py-10">問い合わせデータの取得に失敗しました。</p>;
  }

  const tableStyle = "px-5 py-3 border-b border-gray-300";


  return (
    <>
      <Link href={`/admin/products`}>
      トップページへ戻る
      </Link>
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-center">問い合わせ一覧</h1>

        <div className="shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className={tableStyle}>ID</th>
                <th className={tableStyle}>氏名</th>
                <th className={tableStyle}>メールアドレス</th>
                <th className={tableStyle}>お問い合わせ内容</th>
                <th className={tableStyle}>送信日時</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className={`${tableStyle} text-center text-gray-500`}>
                    問い合わせが見つかりませんでした。
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-100">
                    <td className={tableStyle}>{contact.id}</td>
                    <td className={tableStyle}>{contact.name}</td>
                    <td className={tableStyle}>{contact.email}</td>
                    <td className={tableStyle}>{contact.message}</td>
                    <td className={tableStyle}>
                      {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
    );
}