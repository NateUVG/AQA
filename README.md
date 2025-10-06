# 🎭 Demo de Playwright - Pruebas Automatizadas

Una demostración  de pruebas automatizadas con Playwright que incluye formularios, validaciones, manejo de errores y presentación de resultados.

## 🚀 Características

- **Formularios Interactivos**: Registro de usuario, formulario de contacto y proceso de compra
- **Validaciones en Tiempo Real**: Validación de campos con feedback inmediato
- **Manejo de Errores**: Prevención de envío con errores y mensajes descriptivos
- **Pruebas Automatizadas**: Suite completa de pruebas con Playwright
- **Reportes Detallados**: Generación de reportes HTML y JSON
- **Múltiples Navegadores**: Soporte para Chrome, Firefox y Safari

## 📋 Casos de Uso Incluidos

### 1. Formulario de Registro
- Validación de campos requeridos
- Validación de formato de email
- Validación de longitud de contraseña
- Confirmación de contraseña
- Validación de rango de edad
- Aceptación de términos y condiciones

### 2. Formulario de Contacto
- Validación de campos requeridos
- Selección de asunto
- Contador de caracteres en tiempo real
- Selección de prioridad
- Validación de longitud mínima de mensaje

### 3. Proceso de Compra
- Validación de número de tarjeta (algoritmo de Luhn)
- Formateo automático de campos
- Validación de fecha de vencimiento
- Validación de CVV
- Validación de dirección de facturación

## 🛠️ Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   # Si tienes git
   git clone <url-del-repositorio>
   cd playwright-demo
   
   # O simplemente descargar y extraer los archivos
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Instalar navegadores de Playwright**
   ```bash
   npx playwright install
   ```

4. **Ejecutar la aplicación de demostración**
   ```bash
   npm run dev
   ```

## 🧪 Ejecución de Pruebas

### Comandos Básicos

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con interfaz gráfica (headed mode)
npm run test:headed

# Ejecutar con UI de Playwright
npm run test:ui

# Ver reporte HTML
npm run test:report
```

### Comandos Avanzados

```bash
# Ejecutar en navegador específico
npx playwright test --project firefox
npx playwright test --project webkit

# Ejecutar pruebas específicas
npx playwright test --grep "registro"
npx playwright test --grep "validación"

# Ejecutar con diferentes reporteros
npx playwright test --reporter html
npx playwright test --reporter json
npx playwright test --reporter junit
```

### Scripts de Automatización

```bash
# Instalar dependencias y ejecutar pruebas
node scripts/run-tests.js --install

# Ejecutar todas las pruebas con reporte
node scripts/run-tests.js --all

# Generar reporte de resumen
node scripts/generate-report.js

# Generar y abrir reporte
node scripts/generate-report.js --open
```

## 📊 Estructura de Pruebas

```
tests/
├── registration.spec.js    # Pruebas del formulario de registro
├── contact.spec.js         # Pruebas del formulario de contacto
├── checkout.spec.js        # Pruebas del proceso de compra
├── navigation.spec.js      # Pruebas de navegación y UI
└── error-handling.spec.js  # Pruebas de manejo de errores
```

### Categorías de Pruebas

1. **Validación de Campos**
   - Campos requeridos
   - Formatos específicos (email, teléfono, etc.)
   - Longitud mínima/máxima
   - Rangos numéricos

2. **Validación en Tiempo Real**
   - Confirmación de contraseña
   - Contador de caracteres
   - Formateo automático

3. **Manejo de Errores**
   - Prevención de envío con errores
   - Mensajes de error descriptivos
   - Animaciones de error
   - Limpieza de errores al corregir

4. **Flujos Completos**
   - Envío exitoso de formularios
   - Estados de carga
   - Mensajes de confirmación

## 🎯 Casos de Prueba Destacados

### Identificación de Errores
- **Detección Automática**: Las pruebas identifican automáticamente errores de validación
- **Mensajes Descriptivos**: Cada error tiene un mensaje específico y útil
- **Prevención de Avance**: Los formularios no se envían con errores

### Prevención de Avance
- **Validación Previa**: Verificación de todos los campos antes del envío
- **Bloqueo de Envío**: Botones deshabilitados durante validación
- **Feedback Visual**: Indicadores visuales de estado de campos

### Presentación de Resultados
- **Reportes HTML**: Interfaz visual con estadísticas detalladas
- **Reportes JSON**: Datos estructurados para integración
- **Screenshots**: Capturas automáticas en caso de fallos
- **Videos**: Grabación de sesiones de prueba

## 🔧 Configuración

### playwright.config.js
```javascript
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
```

## 📈 Interpretación de Resultados

### Reporte HTML
- **Resumen General**: Estadísticas de ejecución
- **Detalles por Prueba**: Resultados individuales
- **Screenshots**: Capturas de fallos
- **Timeline**: Tiempo de ejecución

### Indicadores de Éxito
- ✅ **Verde**: Prueba exitosa
- ❌ **Rojo**: Prueba fallida
- ⏱️ **Tiempo**: Duración de ejecución
- 📊 **Cobertura**: Porcentaje de casos cubiertos

## 🚨 Solución de Problemas

### Errores Comunes

1. **Navegadores no instalados**
   ```bash
   npx playwright install
   ```

2. **Puerto ocupado**
   ```bash
   # Cambiar puerto en package.json
   "dev": "npx http-server demo-app -p 3001"
   ```

3. **Dependencias faltantes**
   ```bash
   npm install
   ```

### Debugging

```bash
# Ejecutar en modo debug
npx playwright test --debug

# Ejecutar una prueba específica
npx playwright test tests/registration.spec.js --debug

# Generar trace
npx playwright show-trace trace.zip
```


### Conceptos Demostrados
- **Selección de Elementos**: Uso de selectores CSS y XPath
- **Interacciones**: Clicks, escritura, selección
- **Validaciones**: Verificación de estados y contenido
- **Esperas**: Manejo de elementos asíncronos
- **Assertions**: Verificación de resultados



## 📚 Recursos Adicionales

- [Documentación de Playwright](https://playwright.dev/)
- [Guía de Mejores Prácticas](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Ejemplos de Pruebas](https://github.com/microsoft/playwright/tree/main/tests)





