import { NextRequest, NextResponse } from 'next/server';
import { SearchParams, SearchResponse, ErrorResponse } from '@/types';
import { ContentManager } from '@/lib/content-manager';
import { ExternalSiteManager } from '@/lib/external-site-manager';

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    const body = await request.json();

    // Extract search parameters
    const params: SearchParams = {
      keyword: body.keyword || body.word || '',
      site_code: body.category ? [parseInt(body.category)] : [],
      page: parseInt(body.page || '1'),
      per_page: parseInt(body.per_page || '10'),
      limit: parseInt(body.limit || '0')
    };

    // Initialize managers
    const contentManager = new ContentManager();
    const externalSiteManager = new ExternalSiteManager();

    // Perform search
    const results = await contentManager.searchContent(
      params.keyword,
      params.site_code,
      params.limit
    );

    // If external sites are included in the search
    if (params.site_code.includes(4)) {
      const externalResults = await externalSiteManager.searchContent(params.keyword);
      results.results = [...results.results, ...externalResults];
    }

    // Sort results by date
    results.results.sort((a, b) => 
      new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
    );

    // Apply pagination
    const start = (params.page - 1) * params.per_page;
    const end = start + params.per_page;
    const paginatedResults = results.results.slice(start, end);

    const response: SearchResponse = {
      status: 'success',
      results: paginatedResults,
      pagination: {
        total: results.results.length,
        page: params.page,
        per_page: params.per_page
      },
      search_metadata: {
        execution_time: (Date.now() - startTime) / 1000
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    const errorResponse: ErrorResponse = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        error: 'Internal Server Error',
        message: '検索処理に失敗しました',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }
    };
    return NextResponse.json(errorResponse.body, { status: errorResponse.statusCode });
  }
} 