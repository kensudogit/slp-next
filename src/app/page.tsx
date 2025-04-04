'use client';

import { useState } from 'react';
import { SearchResult } from '@/types';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [siteCode, setSiteCode] = useState<number[]>([1, 2, 3, 4]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          site_code: siteCode,
          page: 1,
          per_page: 10,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Content Search</h1>
        
        <div className="mb-8">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter search keyword"
            className="w-full p-2 border rounded"
          />
          
          <div className="mt-4">
            <label className="block mb-2">Search in:</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((code) => (
                <label key={code} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={siteCode.includes(code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSiteCode([...siteCode, code]);
                      } else {
                        setSiteCode(siteCode.filter((c) => c !== code));
                      }
                    }}
                    className="mr-2"
                  />
                  {code === 4 ? 'External Sites' : `Site ${code}`}
                </label>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="p-4 border rounded">
              <h2 className="text-xl font-semibold">
                <a href={result.url} className="text-blue-600 hover:underline">
                  {result.title}
                </a>
              </h2>
              <p className="text-gray-600 mt-2">
                {result.content.substring(0, 200)}...
              </p>
              <div className="mt-2 text-sm text-gray-500">
                <span>Site: {result.site_code}</span>
                <span className="ml-4">Date: {new Date(result.post_date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 