// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Formulario de Contacto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab="contact"]');
  });

  test('debería mostrar el formulario de contacto correctamente', async ({ page }) => {
    // Verificar que el formulario esté visible
    await expect(page.locator('#contactForm')).toBeVisible();
    
    // Verificar que todos los campos estén presentes
    await expect(page.locator('#contactName')).toBeVisible();
    await expect(page.locator('#contactEmail')).toBeVisible();
    await expect(page.locator('#subject')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
    await expect(page.locator('input[name="priority"]')).toHaveCount(3);
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('debería validar campos requeridos', async ({ page }) => {
    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]');
    
    // Verificar que aparezcan mensajes de error
    await expect(page.locator('#contactNameError')).toContainText('El nombre es requerido');
    await expect(page.locator('#contactEmailError')).toContainText('El email es requerido');
    await expect(page.locator('#subjectError')).toContainText('Debes seleccionar un asunto');
    await expect(page.locator('#messageError')).toContainText('El mensaje es requerido');
    
    // Verificar que los campos tengan clase de error
    await expect(page.locator('#contactName')).toHaveClass(/error/);
    await expect(page.locator('#contactEmail')).toHaveClass(/error/);
    await expect(page.locator('#subject')).toHaveClass(/error/);
    await expect(page.locator('#message')).toHaveClass(/error/);
  });

  test('debería validar formato de email', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#contactName', 'María García');
    await page.selectOption('#subject', 'support');
    await page.fill('#message', 'Este es un mensaje de prueba');
    
    // Probar emails inválidos
    const invalidEmails = ['email-invalido', '@dominio.com', 'usuario@', 'usuario@dominio'];
    
    for (const email of invalidEmails) {
      await page.fill('#contactEmail', email);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('#contactEmailError')).toContainText('Formato de email inválido');
      await expect(page.locator('#contactEmail')).toHaveClass(/error/);
    }
  });

  test('debería validar longitud mínima del mensaje', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#contactName', 'María García');
    await page.fill('#contactEmail', 'maria@ejemplo.com');
    await page.selectOption('#subject', 'support');
    
    // Probar mensaje muy corto
    await page.fill('#message', 'Hola');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#messageError')).toContainText('El mensaje debe tener al menos 10 caracteres');
    await expect(page.locator('#message')).toHaveClass(/error/);
  });

  test('debería mostrar contador de caracteres en tiempo real', async ({ page }) => {
    const messageField = page.locator('#message');
    const counter = page.locator('#messageCount');
    
    // Verificar contador inicial
    await expect(counter).toContainText('0');
    
    // Escribir texto y verificar contador
    await messageField.fill('Hola mundo');
    await expect(counter).toContainText('10');
    
    // Escribir más texto
    await messageField.fill('Este es un mensaje más largo para probar el contador de caracteres');
    await expect(counter).toContainText('67');
  });

  test('debería cambiar color del contador según la longitud', async ({ page }) => {
    const messageField = page.locator('#message');
    const counter = page.locator('#messageCount');
    
    // Texto normal (menos de 400 caracteres)
    await messageField.fill('Mensaje normal');
    await expect(counter).toHaveCSS('color', 'rgb(102, 102, 102)');
    
    // Texto largo (más de 400 caracteres)
    const longText = 'A'.repeat(450);
    await messageField.fill(longText);
    await expect(counter).toHaveCSS('color', 'rgb(231, 76, 60)');
  });

  test('debería validar selección de asunto', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#contactName', 'María García');
    await page.fill('#contactEmail', 'maria@ejemplo.com');
    await page.fill('#message', 'Este es un mensaje de prueba');
    
    // No seleccionar asunto
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#subjectError')).toContainText('Debes seleccionar un asunto');
    await expect(page.locator('#subject')).toHaveClass(/error/);
  });

  test('debería permitir selección de prioridad', async ({ page }) => {
    // Verificar que la prioridad baja esté seleccionada por defecto
    await expect(page.locator('input[name="priority"][value="low"]')).toBeChecked();
    
    // Cambiar a prioridad media
    await page.check('input[name="priority"][value="medium"]');
    await expect(page.locator('input[name="priority"][value="medium"]')).toBeChecked();
    await expect(page.locator('input[name="priority"][value="low"]')).not.toBeChecked();
    
    // Cambiar a prioridad alta
    await page.check('input[name="priority"][value="high"]');
    await expect(page.locator('input[name="priority"][value="high"]')).toBeChecked();
    await expect(page.locator('input[name="priority"][value="medium"]')).not.toBeChecked();
  });

  test('debería permitir envío exitoso con datos válidos', async ({ page }) => {
    // Llenar formulario con datos válidos
    await page.fill('#contactName', 'María García');
    await page.fill('#contactEmail', 'maria@ejemplo.com');
    await page.selectOption('#subject', 'support');
    await page.fill('#message', 'Este es un mensaje de prueba para el formulario de contacto');
    await page.check('input[name="priority"][value="high"]');
    
    // Enviar formulario
    await page.click('button[type="submit"]');
    
    // Verificar que aparezca el mensaje de éxito
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#resultMessage')).toContainText('Mensaje enviado exitosamente');
    await expect(page.locator('#resultMessage')).toHaveClass(/success/);
    
    // Verificar que los campos tengan clase de validación
    await expect(page.locator('#contactName')).toHaveClass(/valid/);
    await expect(page.locator('#contactEmail')).toHaveClass(/valid/);
    await expect(page.locator('#subject')).toHaveClass(/valid/);
    await expect(page.locator('#message')).toHaveClass(/valid/);
  });

  test('debería mostrar estado de carga durante envío', async ({ page }) => {
    // Llenar formulario con datos válidos
    await page.fill('#contactName', 'María García');
    await page.fill('#contactEmail', 'maria@ejemplo.com');
    await page.selectOption('#subject', 'support');
    await page.fill('#message', 'Este es un mensaje de prueba');
    
    // Enviar formulario y verificar estado de carga
    await page.click('button[type="submit"]');
    
    // Verificar que el botón muestre estado de carga
    await expect(page.locator('button[type="submit"]')).toContainText('Procesando...');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toHaveClass(/loading/);
  });

  test('debería limpiar errores al corregir campos', async ({ page }) => {
    // Generar errores
    await page.click('button[type="submit"]');
    
    // Corregir un campo
    await page.fill('#contactName', 'María García');
    
    // Verificar que el error se limpie
    await expect(page.locator('#contactNameError')).toBeEmpty();
    await expect(page.locator('#contactName')).toHaveClass(/valid/);
    await expect(page.locator('#contactName')).not.toHaveClass(/error/);
  });

  test('debería validar límite máximo de caracteres en mensaje', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#contactName', 'María García');
    await page.fill('#contactEmail', 'maria@ejemplo.com');
    await page.selectOption('#subject', 'support');
    
    // Probar mensaje que excede el límite
    const longMessage = 'A'.repeat(501);
    await page.fill('#message', longMessage);
    
    // Verificar que el contador muestre el límite excedido
    await expect(page.locator('#messageCount')).toContainText('501');
    await expect(page.locator('#messageCount')).toHaveCSS('color', 'rgb(231, 76, 60)');
  });
});
