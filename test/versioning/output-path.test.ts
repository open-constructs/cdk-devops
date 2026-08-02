import {
  DEFAULT_VERSION_OUTPUT_PATH,
  LEGACY_VERSION_OUTPUT_PATH,
  validateOutputPath,
  shellSafePath,
} from '../../src/versioning/output-path';

describe('output-path', () => {
  describe('DEFAULT_VERSION_OUTPUT_PATH', () => {
    it('should be .tmp/version.json', () => {
      expect(DEFAULT_VERSION_OUTPUT_PATH).toBe('.tmp/version.json');
    });

    it('should not start with a shell-hazardous character', () => {
      const basename = DEFAULT_VERSION_OUTPUT_PATH.split('/').pop()!;
      expect(basename).not.toMatch(/^[~\-#]/);
    });
  });

  describe('LEGACY_VERSION_OUTPUT_PATH', () => {
    it('should be ~version.json', () => {
      expect(LEGACY_VERSION_OUTPUT_PATH).toBe('~version.json');
    });
  });

  describe('validateOutputPath', () => {
    it('should accept safe paths', () => {
      expect(() => validateOutputPath('.tmp/version.json')).not.toThrow();
      expect(() => validateOutputPath('build/version.json')).not.toThrow();
      expect(() => validateOutputPath('.version.tmp.json')).not.toThrow();
      expect(() => validateOutputPath('/absolute/path/version.json')).not.toThrow();
      expect(() => validateOutputPath('nested/deep/dir/out.json')).not.toThrow();
    });

    it('should reject paths with leading tilde in filename', () => {
      expect(() => validateOutputPath('~version.json')).toThrow(/unsafe for shell usage/);
      expect(() => validateOutputPath('dir/~output.json')).toThrow(/unsafe for shell usage/);
      expect(() => validateOutputPath('~')).toThrow(/unsafe for shell usage/);
    });

    it('should reject paths with leading dash in filename', () => {
      expect(() => validateOutputPath('-version.json')).toThrow(/unsafe for shell usage/);
      expect(() => validateOutputPath('dir/-output.json')).toThrow(/unsafe for shell usage/);
    });

    it('should reject paths with leading hash in filename', () => {
      expect(() => validateOutputPath('#version.json')).toThrow(/unsafe for shell usage/);
      expect(() => validateOutputPath('dir/#output.json')).toThrow(/unsafe for shell usage/);
    });

    it('should reject empty paths', () => {
      expect(() => validateOutputPath('')).toThrow(/must not be empty/);
      expect(() => validateOutputPath('   ')).toThrow(/must not be empty/);
    });

    it('should allow leading dot in filename (dotfiles are inert)', () => {
      expect(() => validateOutputPath('.version.json')).not.toThrow();
      expect(() => validateOutputPath('dir/.output.json')).not.toThrow();
    });
  });

  describe('shellSafePath', () => {
    it('should prefix relative paths with ./', () => {
      expect(shellSafePath('.tmp/version.json')).toBe('./.tmp/version.json');
      expect(shellSafePath('build/out.json')).toBe('./build/out.json');
      expect(shellSafePath('version.json')).toBe('./version.json');
    });

    it('should not double-prefix paths already starting with ./', () => {
      expect(shellSafePath('./build/out.json')).toBe('./build/out.json');
    });

    it('should not prefix paths starting with ../', () => {
      expect(shellSafePath('../build/out.json')).toBe('../build/out.json');
    });

    it('should not prefix absolute paths', () => {
      expect(shellSafePath('/tmp/version.json')).toBe('/tmp/version.json');
      expect(shellSafePath('/home/user/build/out.json')).toBe('/home/user/build/out.json');
    });
  });

  describe('regression: no emitted path contains unquoted tilde token', () => {
    /**
     * Asserts that no shell command string produced by the path helpers
     * contains a token matching /(^|\s)~[^/\s]/ — i.e., tilde followed by
     * a non-slash, non-whitespace character, which triggers tilde expansion.
     */
    it('shellSafePath of default output should not produce a tilde-expansion token', () => {
      const rendered = shellSafePath(DEFAULT_VERSION_OUTPUT_PATH);
      expect(rendered).not.toMatch(/(^|\s)~[^/\s]/);
    });

    it('no safe path through shellSafePath should contain a tilde-expansion token', () => {
      const safePaths = [
        '.tmp/version.json',
        'build/version.json',
        '.version.tmp.json',
        '/tmp/version.json',
        './output/version.json',
        '../parent/version.json',
      ];

      for (const p of safePaths) {
        const rendered = shellSafePath(p);
        expect(rendered).not.toMatch(/(^|\s)~[^/\s]/);
      }
    });

    it('cat command with default path should not contain a tilde-expansion token', () => {
      const cmd = `cat ${shellSafePath(DEFAULT_VERSION_OUTPUT_PATH)}`;
      expect(cmd).not.toMatch(/(^|\s)~[^/\s]/);
    });
  });
});
