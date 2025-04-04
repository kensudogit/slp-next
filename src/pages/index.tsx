import Head from 'next/head';
import Search from '../components/Search';

export default function Home() {
  return (
    <>
      <Head>
        <title>Content Search</title>
        <meta name="description" content="Search through our content" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Content Search
          </h1>
          <Search />
        </div>
      </main>
    </>
  );
} 