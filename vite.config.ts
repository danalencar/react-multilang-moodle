// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      entryRoot: path.resolve(__dirname, 'src'),
      tsconfigPath: path.resolve(__dirname, 'tsconfig.build.json'),
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReactMultilangMoodle',
      fileName: (format) => `react-multilang-moodle.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {

      external: (id) => {

        return ['react', 'react-dom', 'react-i18next'].some(
          (pkg) => id.startsWith(pkg)
        );
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-i18next': 'ReactI18Next'
        },
      },
    },
  },
});