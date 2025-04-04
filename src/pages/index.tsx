// アプリケーションのホームページコンポーネント
import Head from 'next/head';
import Search from '../components/Search';

// ホームページのメインコンポーネント
export default function Home() {
  return (
    <>
      {/* ページのメタ情報を設定 */}
      <Head>
        <title>Content Search</title>
        <meta name="description" content="Search through our content" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* メインコンテンツエリア */}
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          {/* ページタイトル */}
          <h1 className="text-3xl font-bold text-center mb-8">
            Content Search
          </h1>
          {/* 検索コンポーネント */}
          <Search />
        </div>
      </main>
    </>
  );
} 