// インメモリキャッシュクラス
// キーと値のペアをメモリ上に保存し、TTL（Time To Live）に基づいて自動的に期限切れを管理
export class Cache {
  // キャッシュデータを保持するMap
  // key: キャッシュキー
  // value: { value: キャッシュ値, expires: 有効期限（ミリ秒） }
  private cache: Map<string, { value: any; expires: number }>;

  // コンストラクタ
  // キャッシュ用のMapを初期化
  constructor() {
    this.cache = new Map();
  }

  // キャッシュから値を取得
  // key: キャッシュキー
  // 戻り値: キャッシュ値（存在しないか期限切れの場合はnull）
  async get(key: string): Promise<any> {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  // キャッシュに値を設定
  // key: キャッシュキー
  // value: キャッシュ値
  // ttl: 有効期限（ミリ秒、デフォルトは5分）
  async set(key: string, value: any, ttl: number = 300000): Promise<void> {
    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires });
  }

  // キャッシュから値を削除
  // key: キャッシュキー
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  // キャッシュをクリア
  async clear(): Promise<void> {
    this.cache.clear();
  }
} 