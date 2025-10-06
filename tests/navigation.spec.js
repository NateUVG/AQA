// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navegación y UI General', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debería cargar la página principal correctamente', async ({ page }) => {
    // Verificar título de la página
    await expect(page).toHaveTitle('Demo Playwright - Formularios y Validaciones');
    
    // Verificar que el header esté visible
    await expect(page.locator('header h1')).toContainText('Demo de Pruebas Automatizadas con Playwright');
    await expect(page.locator('header p')).toContainText('Formularios, validaciones y manejo de errores');
  });

  test('debería mostrar las pestañas de navegación', async ({ page }) => {
    // Verificar que las pestañas estén visibles
    await expect(page.locator('[data-tab="registration"]')).toBeVisible();
    await expect(page.locator('[data-tab="contact"]')).toBeVisible();
    await expect(page.locator('[data-tab="checkout"]')).toBeVisible();
    
    // Verificar texto de las pestañas
    await expect(page.locator('[data-tab="registration"]')).toContainText('Registro de Usuario');
    await expect(page.locator('[data-tab="contact"]')).toContainText('Formulario de Contacto');
    await expect(page.locator('[data-tab="checkout"]')).toContainText('Proceso de Compra');
  });

  test('debería mostrar el formulario de registro por defecto', async ({ page }) => {
    // Verificar que la pestaña de registro esté activa
    await expect(page.locator('[data-tab="registration"]')).toHaveClass(/active/);
    
    // Verificar que el contenido de registro esté visible
    await expect(page.locator('#registration')).toHaveClass(/active/);
    await expect(page.locator('#registrationForm')).toBeVisible();
    
    // Verificar que otros contenidos no estén visibles
    await expect(page.locator('#contact')).not.toHaveClass(/active/);
    await expect(page.locator('#checkout')).not.toHaveClass(/active/);
  });

  test('debería cambiar a formulario de contacto al hacer clic en la pestaña', async ({ page }) => {
    // Hacer clic en la pestaña de contacto
    await page.click('[data-tab="contact"]');
    
    // Verificar que la pestaña de contacto esté activa
    await expect(page.locator('[data-tab="contact"]')).toHaveClass(/active/);
    await expect(page.locator('[data-tab="registration"]')).not.toHaveClass(/active/);
    await expect(page.locator('[data-tab="checkout"]')).not.toHaveClass(/active/);
    
    // Verificar que el contenido de contacto esté visible
    await expect(page.locator('#contact')).toHaveClass(/active/);
    await expect(page.locator('#contactForm')).toBeVisible();
    
    // Verificar que otros contenidos no estén visibles
    await expect(page.locator('#registration')).not.toHaveClass(/active/);
    await expect(page.locator('#checkout')).not.toHaveClass(/active/);
  });

  test('debería cambiar a proceso de compra al hacer clic en la pestaña', async ({ page }) => {
    // Hacer clic en la pestaña de checkout
    await page.click('[data-tab="checkout"]');
    
    // Verificar que la pestaña de checkout esté activa
    await expect(page.locator('[data-tab="checkout"]')).toHaveClass(/active/);
    await expect(page.locator('[data-tab="registration"]')).not.toHaveClass(/active/);
    await expect(page.locator('[data-tab="contact"]')).not.toHaveClass(/active/);
    
    // Verificar que el contenido de checkout esté visible
    await expect(page.locator('#checkout')).toHaveClass(/active/);
    await expect(page.locator('#checkoutForm')).toBeVisible();
    
    // Verificar que otros contenidos no estén visibles
    await expect(page.locator('#registration')).not.toHaveClass(/active/);
    await expect(page.locator('#contact')).not.toHaveClass(/active/);
  });

  test('debería volver al formulario de registro desde otras pestañas', async ({ page }) => {
    // Ir a contacto
    await page.click('[data-tab="contact"]');
    await expect(page.locator('#contact')).toHaveClass(/active/);
    
    // Volver a registro
    await page.click('[data-tab="registration"]');
    await expect(page.locator('#registration')).toHaveClass(/active/);
    await expect(page.locator('#contact')).not.toHaveClass(/active/);
    
    // Ir a checkout
    await page.click('[data-tab="checkout"]');
    await expect(page.locator('#checkout')).toHaveClass(/active/);
    
    // Volver a registro
    await page.click('[data-tab="registration"]');
    await expect(page.locator('#registration')).toHaveClass(/active/);
    await expect(page.locator('#checkout')).not.toHaveClass(/active/);
  });

  test('debería ocultar resultados al cambiar de pestaña', async ({ page }) => {
    // Completar y enviar formulario de registro
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    await page.click('button[type="submit"]');
    
    // Verificar que aparezcan los resultados
    await expect(page.locator('#results')).toBeVisible();
    
    // Cambiar a otra pestaña
    await page.click('[data-tab="contact"]');
    
    // Verificar que los resultados se oculten
    await expect(page.locator('#results')).not.toBeVisible();
  });

  test('debería mostrar botón de reset cuando hay resultados', async ({ page }) => {
    // Completar y enviar formulario
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    await page.click('button[type="submit"]');
    
    // Verificar que aparezca el botón de reset
    await expect(page.locator('#resetForm')).toBeVisible();
    await expect(page.locator('#resetForm')).toContainText('Nuevo Formulario');
  });

  test('debería resetear formularios al hacer clic en reset', async ({ page }) => {
    // Completar formulario de registro
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    
    // Enviar formulario
    await page.click('button[type="submit"]');
    
    // Verificar que aparezcan los resultados
    await expect(page.locator('#results')).toBeVisible();
    
    // Hacer clic en reset
    await page.click('#resetForm');
    
    // Verificar que los resultados se oculten
    await expect(page.locator('#results')).not.toBeVisible();
    
    // Verificar que los campos se hayan limpiado
    await expect(page.locator('#firstName')).toHaveValue('');
    await expect(page.locator('#lastName')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('#password')).toHaveValue('');
    await expect(page.locator('#confirmPassword')).toHaveValue('');
    await expect(page.locator('#age')).toHaveValue('');
    await expect(page.locator('#terms')).not.toBeChecked();
    
    // Verificar que no haya clases de error o validación
    await expect(page.locator('#firstName')).not.toHaveClass(/error|valid/);
    await expect(page.locator('#lastName')).not.toHaveClass(/error|valid/);
    await expect(page.locator('#email')).not.toHaveClass(/error|valid/);
  });

  test('debería resetear formularios en todas las pestañas', async ({ page }) => {
    // Completar formulario de registro
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    await page.click('button[type="submit"]');
    
    // Ir a contacto y completar formulario
    await page.click('[data-tab="contact"]');
    await page.fill('#contactName', 'María');
    await page.fill('#contactEmail', 'maria@ejemplo.com');
    await page.selectOption('#subject', 'support');
    await page.fill('#message', 'Mensaje de prueba');
    await page.click('button[type="submit"]');
    
    // Ir a checkout y completar formulario
    await page.click('[data-tab="checkout"]');
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Dirección de prueba');
    await page.click('button[type="submit"]');
    
    // Hacer clic en reset
    await page.click('#resetForm');
    
    // Verificar que todos los formularios se hayan limpiado
    // Registro
    await page.click('[data-tab="registration"]');
    await expect(page.locator('#firstName')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
    
    // Contacto
    await page.click('[data-tab="contact"]');
    await expect(page.locator('#contactName')).toHaveValue('');
    await expect(page.locator('#contactEmail')).toHaveValue('');
    await expect(page.locator('#message')).toHaveValue('');
    
    // Checkout
    await page.click('[data-tab="checkout"]');
    await expect(page.locator('#cardNumber')).toHaveValue('');
    await expect(page.locator('#cardName')).toHaveValue('');
    await expect(page.locator('#billingAddress')).toHaveValue('');
  });

  test('debería ser responsive en dispositivos móviles', async ({ page }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que las pestañas se apilen verticalmente
    const tabs = page.locator('.tabs');
    await expect(tabs).toHaveCSS('flex-direction', 'column');
    
    // Verificar que el formulario sea responsive
    const formContainer = page.locator('.form-container');
    await expect(formContainer).toBeVisible();
    
    // Verificar que los campos de fila se apilen
    const formRow = page.locator('.form-row');
    if (await formRow.count() > 0) {
      await expect(formRow).toHaveCSS('grid-template-columns', '1fr');
    }
  });

  test('debería mantener estado de formularios al cambiar entre pestañas', async ({ page }) => {
    // Completar parcialmente formulario de registro
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    
    // Cambiar a contacto
    await page.click('[data-tab="contact"]');
    await page.fill('#contactName', 'María');
    
    // Volver a registro
    await page.click('[data-tab="registration"]');
    
    // Verificar que los datos se mantengan
    await expect(page.locator('#firstName')).toHaveValue('Juan');
    await expect(page.locator('#lastName')).toHaveValue('Pérez');
    
    // Volver a contacto
    await page.click('[data-tab="contact"]');
    
    // Verificar que los datos se mantengan
    await expect(page.locator('#contactName')).toHaveValue('María');
  });
});
