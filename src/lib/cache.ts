export class Cache {
  private cache: Map<string, { value: any; expires: number }>;

  constructor() {
    this.cache = new Map();
  }

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

  async set(key: string, value: any, ttl: number = 300000): Promise<void> {
    const expires = Date.now() + ttl;
    this.cache.set(key, { value, expires });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
} 