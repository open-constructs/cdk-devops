import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { readVersionFile } from '../../src/versioning/compute-version';
import { DEFAULT_VERSION_OUTPUT_PATH, LEGACY_VERSION_OUTPUT_PATH, validateOutputPath } from '../../src/versioning/output-path';

describe('compute-version', () => {
  let tmpDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-test-'));
    originalCwd = process.cwd();
    process.chdir(tmpDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('readVersionFile', () => {
    it('should read from the default path when it exists', () => {
      const outputDir = path.dirname(DEFAULT_VERSION_OUTPUT_PATH);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(DEFAULT_VERSION_OUTPUT_PATH, '{"version":"1.0.0"}');

      const result = readVersionFile();
      expect(result).toBe('{"version":"1.0.0"}');
    });

    it('should read from a custom path when specified', () => {
      fs.mkdirSync('custom', { recursive: true });
      fs.writeFileSync('custom/ver.json', '{"version":"2.0.0"}');

      const result = readVersionFile('custom/ver.json');
      expect(result).toBe('{"version":"2.0.0"}');
    });

    it('should fall back to legacy ~version.json with a deprecation warning', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      fs.writeFileSync(LEGACY_VERSION_OUTPUT_PATH, '{"version":"0.9.0"}');

      const result = readVersionFile();
      expect(result).toBe('{"version":"0.9.0"}');
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEPRECATED]'),
      );
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(LEGACY_VERSION_OUTPUT_PATH),
      );

      warnSpy.mockRestore();
    });

    it('should prefer default path over legacy path', () => {
      const outputDir = path.dirname(DEFAULT_VERSION_OUTPUT_PATH);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(DEFAULT_VERSION_OUTPUT_PATH, '{"version":"1.0.0"}');
      fs.writeFileSync(LEGACY_VERSION_OUTPUT_PATH, '{"version":"0.9.0"}');

      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const result = readVersionFile();
      expect(result).toBe('{"version":"1.0.0"}');
      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it('should return undefined when no version file exists', () => {
      const result = readVersionFile();
      expect(result).toBeUndefined();
    });
  });

  describe('output path validation in CLI context', () => {
    it('should reject --output with a tilde-prefixed filename', () => {
      expect(() => validateOutputPath('~version.json')).toThrow(/unsafe for shell usage/);
    });

    it('should reject --output with a dash-prefixed filename', () => {
      expect(() => validateOutputPath('-output.json')).toThrow(/unsafe for shell usage/);
    });

    it('should reject --output with a hash-prefixed filename', () => {
      expect(() => validateOutputPath('#output.json')).toThrow(/unsafe for shell usage/);
    });
  });
});
