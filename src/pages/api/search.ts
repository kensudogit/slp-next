import { NextApiRequest, NextApiResponse } from 'next';
import { SearchResult } from '../../types';
import { ContentManager } from '../../lib/content-manager';

const contentManager = new ContentManager();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await contentManager.search(query);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 