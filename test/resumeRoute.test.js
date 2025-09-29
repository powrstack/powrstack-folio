import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/resume/route';
import {
  loadResumeData,
  refreshResumeData,
  getCacheStatus,
} from '@/lib/resumeLoader';

vi.mock('@/lib/resumeLoader', () => ({
  loadResumeData: vi.fn(),
  refreshResumeData: vi.fn(),
  getCacheStatus: vi.fn(),
}));

describe('api/resume GET', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadResumeData.mockResolvedValue({ ok: true });
    refreshResumeData.mockResolvedValue({ refreshed: true });
    getCacheStatus.mockReturnValue({ memory: { valid: true }, storage: { valid: false } });
  });

  it('returns transformed resume data with metadata by default', async () => {
    const response = await GET(new Request('https://example.com/api/resume'));
    const body = await response.json();

    expect(loadResumeData).toHaveBeenCalledTimes(1);
    expect(body).toEqual({
      data: { ok: true },
      meta: {
        refreshed: false,
        cache: { memory: { valid: true }, storage: { valid: false } },
      },
    });
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300');
    expect(response.headers.get('X-Resume-Source')).toBe('standard');
  });

  it('forces cache refresh when refresh=true', async () => {
    const response = await GET(new Request('https://example.com/api/resume?refresh=true'));
    const body = await response.json();

    expect(refreshResumeData).toHaveBeenCalledTimes(1);
    expect(loadResumeData).not.toHaveBeenCalled();
    expect(body.meta.refreshed).toBe(true);
    expect(response.headers.get('Cache-Control')).toBe('no-store, max-age=0');
    expect(response.headers.get('X-Resume-Source')).toBe('refresh');
  });

  it('omits metadata when meta=false', async () => {
    const response = await GET(new Request('https://example.com/api/resume?meta=false'));
    const body = await response.json();

    expect(body).toEqual({ ok: true });
  });

  it('returns 500 on failure', async () => {
    loadResumeData.mockRejectedValueOnce(new Error('boom'));

    const response = await GET(new Request('https://example.com/api/resume'));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: 'Failed to load resume data' });
  });
});
