// ヘルスチェックAPIのエンドポイント
import { NextApiRequest, NextApiResponse } from 'next';
import { HealthStatus } from '../../types';
import { ContentManager } from '../../lib/content-manager';

// コンテンツ管理クラスのインスタンス化
const contentManager = new ContentManager();

// ヘルスチェックAPIのハンドラー
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus | { error: string }>
) {
  // GETメソッド以外は許可しない
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // コンテンツマネージャーを使用してヘルスチェックを実行
    const healthStatus = await contentManager.checkHealth();
    return res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 