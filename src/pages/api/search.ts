// 検索APIのエンドポイント
import { NextApiRequest, NextApiResponse } from 'next';
import { SearchResult } from '../../types';
import { ContentManager } from '../../lib/content-manager';

// コンテンツ管理クラスのインスタンス化
const contentManager = new ContentManager();

// 検索APIのハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult[] | { error: string }>
) {
  // GETメソッド以外は許可しない
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // クエリパラメータの取得
  const { query } = req.query;

  // クエリパラメータのバリデーション
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // コンテンツマネージャーを使用して検索を実行
    const results = await contentManager.search(query);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 