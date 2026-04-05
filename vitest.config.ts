import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        maxWorkers: 1,
        minWorkers: 1,
        // Top-level configuration (global only)
        coverage: { provider: 'v8' },

        projects: [
            {
                extends: true,
                test: {
                    name: 'unit',
                    include: ['src/**/*.test.ts'],
                    environment: 'node',
                    setupFiles: ['./src/vitest.setup.unit.ts'],
                }
            },
            {
                extends: true,
                test: {
                    name: 'integration',
                    include: ['tests/**/*.test.ts'],
                    environment: 'node',
                    setupFiles: ['./tests/vitest.setup.integration.ts'],
                }
            }
        ]
    }
});