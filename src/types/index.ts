export interface WpPost {
  ID: number;
  post_title: string;
  post_content: string;
  post_excerpt: string;
  post_date: string;
  post_modified: string;
  post_status: string;
  post_type: string;
  post_name: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_mime_type: string;
  comment_count: number;
}

export interface WpPostMeta {
  meta_id: number;
  post_id: number;
  meta_key: string;
  meta_value: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  site_code: number;
  tags: string[];
  files: string[];
  url: string;
  post_date: string;
}

export interface SearchResponse {
  status: string;
  results: SearchResult[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
  };
  search_metadata: {
    execution_time: number;
  };
}

export interface HealthStatus {
  dynamodb: boolean;
  s3: boolean;
  lambda: boolean;
  initialization: boolean;
  timestamp: number;
  memory?: {
    limit: number;
  };
}

export interface ErrorResponse {
  statusCode: number;
  headers: {
    [key: string]: string;
  };
  body: {
    error: string;
    message?: string;
    details?: any;
  };
}

export interface SearchParams {
  keyword?: string;
  site_code?: number[];
  page?: number;
  per_page?: number;
  limit?: number;
} 