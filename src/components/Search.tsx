import { useState } from 'react';
import { SearchResult } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="p-4 border rounded">
              <h2 className="text-xl font-bold mb-2">{result.post.post_title}</h2>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: result.post.post_content }}
              />
              <div className="mt-2 text-sm text-gray-500">
                Last updated: {new Date(result.post.post_modified).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && query && (
          <div className="text-center text-gray-500">
            No results found for "{query}"
          </div>
        )
      )}
    </div>
  );
} 