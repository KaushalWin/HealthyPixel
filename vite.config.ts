import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function normalizeBasePath(value?: string) {
  if (!value) {
    return '/';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const repositoryName = env.GITHUB_REPOSITORY?.split('/')[1];
  const base = normalizeBasePath(
    env.PIXIETRACK_BASE_PATH
      ?? (env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}/` : undefined)
  );

  return {
    base,
    plugins: [react()],
  };
});
