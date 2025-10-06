// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Ejecutar pruebas en paralelo */
  fullyParallel: true,
  /* Fallar la build en CI si accidentalmente dejaste test.only en el código fuente */
  forbidOnly: !!process.env.CI,
  /* Reintentar en CI solo en fallos */
  retries: process.env.CI ? 2 : 0,
  /* Optar por no ejecutar pruebas en paralelo */
  workers: process.env.CI ? 1 : undefined,
  /* Configuración para reporteros */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    ['list']
  ],
  /* Configuración global para todas las pruebas */
  use: {
    /* URL base para usar en acciones como `await page.goto('/')` */
    baseURL: 'http://localhost:3000',
    /* Recopilar trace cuando se repite en el primer intento */
    trace: 'on-first-retry',
    /* Capturar screenshot en fallos */
    screenshot: 'only-on-failure',
    /* Grabar video en fallos */
    video: 'retain-on-failure',
  },

  /* Configurar proyectos para navegadores principales */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Probar contra viewports móviles */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Servidor de desarrollo local */
  webServer: {
    command: 'npx http-server demo-app -p 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
