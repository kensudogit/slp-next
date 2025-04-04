import { WpPost, SearchResult, HealthStatus } from '../types';
import { Cache } from './cache';
import { ExternalSiteManager } from './external-site-manager';

export class ContentManager {
  private cache: Cache;
  private externalSiteManager: ExternalSiteManager;

  constructor() {
    this.cache = new Cache();
    this.externalSiteManager = new ExternalSiteManager();
  }

  async search(query: string): Promise<SearchResult[]> {
    // キャッシュから検索結果を取得
    const cachedResults = await this.cache.get(`search:${query}`);
    if (cachedResults) {
      return cachedResults as SearchResult[];
    }

    // データベースから投稿を取得
    const posts = await this.getPosts();
    
    // 検索クエリに基づいて投稿をフィルタリング
    const results = posts
      .filter(post => this.matchesQuery(post, query))
      .map(post => this.createSearchResult(post, query));

    // 結果をキャッシュに保存
    await this.cache.set(`search:${query}`, results);

    return results;
  }

  private async getPosts(): Promise<WpPost[]> {
    // キャッシュから投稿を取得
    const cachedPosts = await this.cache.get('posts');
    if (cachedPosts) {
      return cachedPosts as WpPost[];
    }

    // データベースから投稿を取得
    const posts = await this.fetchPostsFromDatabase();

    // 投稿をキャッシュに保存
    await this.cache.set('posts', posts);

    return posts;
  }

  private async fetchPostsFromDatabase(): Promise<WpPost[]> {
    // データベースから投稿を取得するロジックを実装
    // この例では空の配列を返す
    return [];
  }

  private matchesQuery(post: WpPost, query: string): boolean {
    const searchText = `${post.post_title} ${post.post_content} ${post.post_excerpt}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  }

  private createSearchResult(post: WpPost, query: string): SearchResult {
    return {
      id: post.ID.toString(),
      title: post.post_title,
      content: post.post_content,
      site_code: 1, // Default site code
      tags: [],
      files: [],
      url: post.guid,
      post_date: post.post_date
    };
  }

  private calculateScore(post: WpPost, query: string): number {
    // スコア計算ロジックを実装
    return 1;
  }

  private highlightText(text: string, query: string): string {
    // テキストハイライトロジックを実装
    return text;
  }

  async checkHealth(): Promise<HealthStatus> {
    const checks = {
      database: await this.checkDatabase(),
      s3: await this.checkS3(),
      externalSites: await this.externalSiteManager.checkHealth()
    };

    return {
      dynamodb: checks.database,
      s3: checks.s3,
      lambda: true,
      initialization: true,
      timestamp: Date.now()
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      // データベース接続チェックを実装
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  private async checkS3(): Promise<boolean> {
    try {
      // S3接続チェックを実装
      return true;
    } catch (error) {
      console.error('S3 health check failed:', error);
      return false;
    }
  }
} 