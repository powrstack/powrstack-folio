import { NextResponse } from 'next/server';
import {
  loadResumeData,
  refreshResumeData,
  getCacheStatus,
} from '@/lib/resumeLoader';
import { logger } from '@/lib/logger';

const TRUTHY_VALUES = new Set(['1', 'true', 'yes', 'on']);
const FALSY_VALUES = new Set(['0', 'false', 'no', 'off']);

function parseBooleanParam(value, defaultValue) {
  if (value === null) {
    return defaultValue;
  }

  const normalized = value.trim().toLowerCase();
  if (TRUTHY_VALUES.has(normalized)) {
    return true;
  }
  if (FALSY_VALUES.has(normalized)) {
    return false;
  }
  return defaultValue;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const refresh = parseBooleanParam(url.searchParams.get('refresh'), false);
    const includeMeta = parseBooleanParam(url.searchParams.get('meta'), true);
    const includeCacheStatus = includeMeta
      ? parseBooleanParam(url.searchParams.get('cache'), true)
      : false;

    const loader = refresh ? refreshResumeData : loadResumeData;
    const resumeData = await loader();

    let payload;
    if (includeMeta) {
      const meta = {
        refreshed: refresh,
      };

      if (includeCacheStatus) {
        meta.cache = getCacheStatus();
      }

      payload = {
        data: resumeData,
        meta,
      };
    } else {
      payload = resumeData;
    }

    const response = NextResponse.json(payload);

    response.headers.set(
      'Cache-Control',
      refresh
        ? 'no-store, max-age=0'
        : 'public, s-maxage=300, stale-while-revalidate=900'
    );
  response.headers.set('X-Resume-Source', refresh ? 'refresh' : 'standard');

    return response;
  } catch (error) {
    logger.error('Error loading resume data:', error);
    return NextResponse.json(
      { error: 'Failed to load resume data' },
      { status: 500 }
    );
  }
}
