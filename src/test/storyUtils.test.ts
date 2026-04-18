import { getDomain, getRelativeTime, getFaviconUrl } from '../utils/storyUtils';

describe('storyUtils', () => {
  describe('getDomain', () => {
    it('extracts domain from URL', () => {
      const result = getDomain('https://news.ycombinator.com/item?id=1');
      expect(result).toBe('news.ycombinator.com');
    });

    it('removes www prefix from domain', () => {
      const result = getDomain('https://www.google.com/search?q=test');
      expect(result).toBe('google.com');
    });

    it('returns original string for invalid URL', () => {
      const result = getDomain('not-a-valid-url');
      expect(result).toBe('not-a-valid-url');
    });
  });

  describe('getRelativeTime', () => {
    it('returns seconds ago for timestamps less than 1 minute', () => {
      const now = Math.floor(Date.now() / 1000);
      const result = getRelativeTime(now - 30);
      expect(result).toBe('30s ago');
    });

    it('returns minutes ago for timestamps between 1-59 minutes', () => {
      const now = Math.floor(Date.now() / 1000);
      const result = getRelativeTime(now - 120);
      expect(result).toBe('2m ago');
    });

    it('returns hours ago for timestamps between 1-23 hours', () => {
      const now = Math.floor(Date.now() / 1000);
      const result = getRelativeTime(now - 7200);
      expect(result).toBe('2h ago');
    });

    it('returns days ago for timestamps 24+ hours', () => {
      const now = Math.floor(Date.now() / 1000);
      const result = getRelativeTime(now - 172800);
      expect(result).toBe('2d ago');
    });
  });

  describe('getFaviconUrl', () => {
    it('generates favicon URL from story URL', () => {
      const result = getFaviconUrl('https://github.com/react-native');
      expect(result).toBe('https://www.google.com/s2/favicons?domain=github.com&sz=64');
    });

    it('handles URLs with www prefix', () => {
      const result = getFaviconUrl('https://www.stackoverflow.com/questions');
      expect(result).toBe('https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64');
    });
  });
});