import { SearchResult } from '../types';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Cache } from './cache';

interface SiteConfig {
  name: string;
  bucket: string;
  prefix: string;
  index_prefix: string;
}

export class ExternalSiteManager {
  private s3Client: S3Client;
  private cache: Cache;
  private sites: SiteConfig[];

  constructor() {
    this.s3Client = new S3Client({});
    this.cache = new Cache();
    this.sites = [
      {
        name: 'information',
        bucket: process.env.CONTENT_BUCKET_NAME || 'kenko21-web',
        prefix: 'information/information/',
        index_prefix: 'information/index/'
      },
      {
        name: 'slp',
        bucket: process.env.CONTENT_BUCKET_NAME || 'kenko21-web',
        prefix: 'slp/',
        index_prefix: 'slp/index/'
      },
      {
        name: 'tools',
        bucket: process.env.CONTENT_BUCKET_NAME || 'kenko21-web',
        prefix: 'tools/',
        index_prefix: 'tools/index/'
      }
    ];
  }

  async searchContent(keyword: string = ''): Promise<SearchResult[]> {
    try {
      const cacheKey = `external_search_${keyword}`;
      const cachedResults = this.cache.get(cacheKey);
      if (cachedResults) {
        return cachedResults;
      }

      const results: SearchResult[] = [];
      for (const site of this.sites) {
        const siteResults = await this.searchSiteContent(site, keyword);
        results.push(...siteResults);
      }

      this.cache.set(cacheKey, results, 300); // Cache for 5 minutes
      return results;
    } catch (error) {
      console.error('Error in searchContent:', error);
      throw error;
    }
  }

  private async searchSiteContent(site: SiteConfig, keyword: string): Promise<SearchResult[]> {
    try {
      const indexMatches = await this.searchIndex(site, keyword);
      return await this.fetchMatchedContents(site, indexMatches);
    } catch (error) {
      console.error(`Error searching site ${site.name}:`, error);
      return [];
    }
  }

  private async searchIndex(site: SiteConfig, keyword: string): Promise<string[]> {
    const matches = new Set<string>();
    const command = new GetObjectCommand({
      Bucket: site.bucket,
      Key: `${site.index_prefix}${keyword.toLowerCase()}.json`
    });

    try {
      const response = await this.s3Client.send(command);
      const indexData = JSON.parse(await response.Body?.transformToString() || '{}');
      if (indexData[keyword.toLowerCase()]) {
        indexData[keyword.toLowerCase()].forEach((match: string) => matches.add(match));
      }
    } catch (error) {
      console.error(`Error searching index for ${site.name}:`, error);
    }

    return Array.from(matches);
  }

  private async fetchMatchedContents(site: SiteConfig, matches: string[]): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const chunkSize = 20;

    for (let i = 0; i < matches.length; i += chunkSize) {
      const chunk = matches.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(pageId => this.fetchContent(site, pageId));
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults.filter(Boolean) as SearchResult[]);
    }

    return results;
  }

  private async fetchContent(site: SiteConfig, pageId: string): Promise<SearchResult | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: site.bucket,
        Key: `${site.prefix}${pageId}.json`
      });

      const response = await this.s3Client.send(command);
      const content = JSON.parse(await response.Body?.transformToString() || '{}');

      return {
        id: pageId,
        title: content.title || '',
        content: content.content || '',
        site_code: 4, // External content site code
        tags: [],
        files: [],
        url: content.url || '',
        post_date: content.last_updated || ''
      };
    } catch (error) {
      console.error(`Error fetching content for ${pageId}:`, error);
      return null;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      // 外部サイトのヘルスチェックを実装
      return true;
    } catch (error) {
      console.error('External site health check failed:', error);
      return false;
    }
  }
} 