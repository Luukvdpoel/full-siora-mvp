import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const eslintrc = JSON.parse(
  fs.readFileSync(new URL('./.eslintrc.json', import.meta.url), 'utf8')
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default compat.config(eslintrc);
