import * as path from 'path';

/**
 * Default output path for the computed version artifact.
 *
 * Uses a `.tmp/` directory to avoid shell-parsing hazards (tilde expansion,
 * glob characters, etc.) and to keep the working tree clean with a single
 * `.gitignore` entry.
 */
export const DEFAULT_VERSION_OUTPUT_PATH = '.tmp/version.json';

/**
 * Legacy output path used in versions <= 0.x.
 * Kept only for backwards-compatible fallback reads during the deprecation window.
 *
 * @deprecated Will be removed in the next minor version.
 */
export const LEGACY_VERSION_OUTPUT_PATH = '~version.json';

/**
 * Characters that are unsafe as the first character of a filename segment
 * in shell contexts. A leading `~` triggers tilde expansion, `-` can be
 * misinterpreted as an option flag, and `#` starts a comment in many shells.
 */
const UNSAFE_LEADING_CHARS = ['~', '-', '#'];

/**
 * Validate a version output file path.
 *
 * Rejects paths whose final segment begins with a character that is hazardous
 * in shell command strings (`~`, `-`, `#`).
 *
 * @param filePath - The path to validate
 * @throws Error if the path is unsafe for shell usage
 */
export function validateOutputPath(filePath: string): void {
  if (!filePath || filePath.trim().length === 0) {
    throw new Error('Version output path must not be empty.');
  }

  const basename = path.basename(filePath);

  for (const char of UNSAFE_LEADING_CHARS) {
    if (basename.startsWith(char)) {
      throw new Error(
        `Version output path is unsafe for shell usage: the filename "${basename}" ` +
        `begins with "${char}". Leading ~, -, and # characters cause shell-parsing ` +
        'hazards (tilde expansion, option flags, comments). ' +
        'Use a path like ".tmp/version.json" or ".version.tmp.json" instead.',
      );
    }
  }
}

/**
 * Render a relative file path safe for embedding in shell command strings.
 *
 * Ensures relative paths start with `./` to prevent misinterpretation by the
 * shell (e.g., a file named `-rf` being parsed as flags to `rm`).
 *
 * @param filePath - The file path to make shell-safe
 * @returns A path string safe for use in shell commands
 */
export function shellSafePath(filePath: string): string {
  // Absolute paths are already unambiguous
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  // Already prefixed with ./ or ../
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return filePath;
  }

  return `./${filePath}`;
}
