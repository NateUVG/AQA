# 🎭 Instrucciones para la Demo de Playwright

## 🚀 Inicio Rápido

### 1. Preparación del Entorno
```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install

# Iniciar la aplicación demo
npm run dev
```

### 2. Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ver reporte
npm run test:report
```

## 🎯 Puntos Clave de la Demo

### Identificación de Errores
- **Validación en Tiempo Real**: Los campos se validan mientras el usuario escribe
- **Mensajes Descriptivos**: Cada error tiene un mensaje específico y útil
- **Indicadores Visuales**: Campos con errores se marcan en rojo con animación

### Prevención de Avance
- **Bloqueo de Envío**: Los formularios no se envían si hay errores
- **Validación Completa**: Se verifican todos los campos antes del envío
- **Estados de Carga**: Botones deshabilitados durante el procesamiento

### Presentación de Resultados
- **Reportes HTML**: Interfaz visual con estadísticas detalladas
- **Screenshots**: Capturas automáticas en caso de fallos
- **Videos**: Grabación de sesiones de prueba
- **Múltiples Formatos**: HTML, JSON, JUnit

## 📋 Casos de Uso Demostrados

### 1. Formulario de Registro
- ✅ Validación de campos requeridos
- ✅ Formato de email
- ✅ Longitud de contraseña
- ✅ Confirmación de contraseña
- ✅ Rango de edad
- ✅ Términos y condiciones

### 2. Formulario de Contacto
- ✅ Campos requeridos
- ✅ Selección de asunto
- ✅ Contador de caracteres
- ✅ Validación de mensaje

### 3. Proceso de Compra
- ✅ Validación de tarjeta (algoritmo de Luhn)
- ✅ Formateo automático
- ✅ Fecha de vencimiento
- ✅ CVV
- ✅ Dirección

## 🧪 Ejecución de Pruebas Específicas

### Por Categoría
```bash
# Solo pruebas de registro
npx playwright test --grep "registro"

# Solo pruebas de validación
npx playwright test --grep "validación"

# Solo pruebas de errores
npx playwright test --grep "error"
```

### Por Navegador
```bash
# Chrome
npx playwright test --project chromium

# Firefox
npx playwright test --project firefox

# Safari
npx playwright test --project webkit
```

### Con Interfaz Gráfica
```bash
# Ver las pruebas ejecutándose
npm run test:headed

# UI interactiva de Playwright
npm run test:ui
```

## 📊 Interpretación de Resultados

### Reporte HTML
- **Resumen**: Estadísticas generales de ejecución
- **Detalles**: Resultados de cada prueba individual
- **Screenshots**: Capturas de pantalla en fallos
- **Timeline**: Tiempo de ejecución de cada paso

### Indicadores de Éxito
- 🟢 **Verde**: Prueba exitosa
- 🔴 **Rojo**: Prueba fallida
- ⏱️ **Tiempo**: Duración de ejecución
- 📈 **Cobertura**: Porcentaje de casos cubiertos

## 🔍 Casos de Prueba Destacados

### Validación de Errores
```javascript
// Ejemplo: Validación de email
test('debería validar formato de email', async ({ page }) => {
  await page.fill('#email', 'email-invalido');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('#emailError'))
    .toContainText('Formato de email inválido');
  await expect(page.locator('#email'))
    .toHaveClass(/error/);
});
```

### Prevención de Avance
```javascript
// Ejemplo: Bloqueo con múltiples errores
test('debería prevenir envío con múltiples errores', async ({ page }) => {
  await page.click('button[type="submit"]');
  
  // Verificar que aparezcan múltiples errores
  await expect(page.locator('#firstNameError')).not.toBeEmpty();
  await expect(page.locator('#lastNameError')).not.toBeEmpty();
  
  // Verificar que no aparezca mensaje de éxito
  await expect(page.locator('#results')).not.toBeVisible();
});
```

### Presentación de Resultados
```javascript
// Ejemplo: Verificación de mensaje de éxito
test('debería permitir envío exitoso', async ({ page }) => {
  // Llenar formulario con datos válidos
  await page.fill('#firstName', 'Juan');
  // ... otros campos
  
  await page.click('button[type="submit"]');
  
  // Verificar mensaje de éxito
  await expect(page.locator('#resultMessage'))
    .toContainText('Registro exitoso');
  await expect(page.locator('#resultMessage'))
    .toHaveClass(/success/);
});
```

## 🎓 Conceptos Demostrados

### 1. Selección de Elementos
- Selectores CSS: `#firstName`, `.error-message`
- Selectores de atributo: `[data-tab="registration"]`
- Selectores de texto: `text=Registro de Usuario`

### 2. Interacciones
- Clicks: `page.click()`
- Escritura: `page.fill()`
- Selección: `page.selectOption()`
- Checkboxes: `page.check()`

### 3. Validaciones
- Visibilidad: `toBeVisible()`
- Contenido: `toContainText()`
- Clases CSS: `toHaveClass()`
- Valores: `toHaveValue()`

### 4. Esperas
- Espera automática de elementos
- Espera de estados específicos
- Timeouts configurables

## 🚨 Solución de Problemas

### Error: Navegadores no instalados
```bash
npx playwright install
```

### Error: Puerto ocupado
```bash
# Cambiar puerto en package.json
"dev": "npx http-server demo-app -p 3001"
```

### Error: Dependencias faltantes
```bash
npm install
```

### Debug de Pruebas
```bash
# Modo debug
npx playwright test --debug

# Una prueba específica
npx playwright test tests/registration.spec.js --debug
```

## 📈 Métricas de Éxito

### Cobertura de Pruebas
- **Formulario de Registro**: 15+ casos de prueba
- **Formulario de Contacto**: 12+ casos de prueba
- **Proceso de Compra**: 18+ casos de prueba
- **Navegación**: 10+ casos de prueba
- **Manejo de Errores**: 15+ casos de prueba

### Tipos de Validación
- ✅ Campos requeridos
- ✅ Formatos específicos
- ✅ Longitudes mínimas/máximas
- ✅ Rangos numéricos
- ✅ Validaciones en tiempo real
- ✅ Algoritmos complejos (Luhn)

## 🎯 Objetivos de la Demo

1. **Demostrar** capacidades de Playwright
2. **Mostrar** mejores prácticas de testing
3. **Enseñar** manejo de errores
4. **Ilustrar** presentación de resultados
5. **Proporcionar** ejemplos prácticos

---

**¡La demo está lista para usar!** 🚀

Ejecuta `npm run dev` para iniciar la aplicación y `npm test` para ver las pruebas en acción.
