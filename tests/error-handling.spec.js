// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Manejo de Errores y Prevención de Avance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('debería prevenir envío con múltiples errores en registro', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Intentar enviar formulario con datos inválidos
    await page.fill('#firstName', 'A'); // Muy corto
    await page.fill('#lastName', ''); // Vacío
    await page.fill('#email', 'email-invalido'); // Formato inválido
    await page.fill('#password', '123'); // Muy corto
    await page.fill('#confirmPassword', '456'); // No coincide
    await page.fill('#age', '15'); // Menor de edad
    // No marcar términos
    
    await page.click('button[type="submit"]');
    
    // Verificar que aparezcan múltiples errores
    await expect(page.locator('#firstNameError')).not.toBeEmpty();
    await expect(page.locator('#lastNameError')).toContainText('El apellido es requerido');
    await expect(page.locator('#emailError')).toContainText('Formato de email inválido');
    await expect(page.locator('#passwordError')).toContainText('La contraseña debe tener al menos 8 caracteres');
    await expect(page.locator('#confirmPasswordError')).toContainText('Las contraseñas no coinciden');
    await expect(page.locator('#ageError')).toContainText('La edad debe estar entre 18 y 100 años');
    await expect(page.locator('#termsError')).toContainText('Debes aceptar los términos');
    
    // Verificar que no aparezca mensaje de éxito
    await expect(page.locator('#results')).not.toBeVisible();
    
    // Verificar que todos los campos tengan clase de error
    await expect(page.locator('#firstName')).toHaveClass(/error/);
    await expect(page.locator('#lastName')).toHaveClass(/error/);
    await expect(page.locator('#email')).toHaveClass(/error/);
    await expect(page.locator('#password')).toHaveClass(/error/);
    await expect(page.locator('#confirmPassword')).toHaveClass(/error/);
    await expect(page.locator('#age')).toHaveClass(/error/);
  });

  test('debería mostrar mensaje de error con conteo de errores', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Generar múltiples errores
    await page.click('button[type="submit"]');
    
    // Verificar mensaje de error general
    await expect(page.locator('#resultMessage')).toContainText('Se encontraron');
    await expect(page.locator('#resultMessage')).toContainText('errores');
    await expect(page.locator('#resultMessage')).toHaveClass(/error/);
  });

  test('debería prevenir envío con errores en formulario de contacto', async ({ page }) => {
    await page.click('[data-tab="contact"]');
    
    // Intentar enviar con datos inválidos
    await page.fill('#contactName', ''); // Vacío
    await page.fill('#contactEmail', 'email-malo'); // Formato inválido
    // No seleccionar asunto
    await page.fill('#message', 'Hola'); // Muy corto
    
    await page.click('button[type="submit"]');
    
    // Verificar errores
    await expect(page.locator('#contactNameError')).toContainText('El nombre es requerido');
    await expect(page.locator('#contactEmailError')).toContainText('Formato de email inválido');
    await expect(page.locator('#subjectError')).toContainText('Debes seleccionar un asunto');
    await expect(page.locator('#messageError')).toContainText('El mensaje debe tener al menos 10 caracteres');
    
    // Verificar que no aparezca mensaje de éxito
    await expect(page.locator('#results')).not.toBeVisible();
  });

  test('debería prevenir envío con errores en proceso de compra', async ({ page }) => {
    await page.click('[data-tab="checkout"]');
    
    // Intentar enviar con datos inválidos
    await page.fill('#cardNumber', '1234 5678 9012 3456'); // Número inválido
    await page.fill('#expiryDate', '13/20'); // Fecha inválida
    await page.fill('#cvv', '12'); // CVV muy corto
    await page.fill('#cardName', ''); // Vacío
    await page.fill('#billingAddress', ''); // Vacío
    
    await page.click('button[type="submit"]');
    
    // Verificar errores
    await expect(page.locator('#cardNumberError')).toContainText('Número de tarjeta inválido');
    await expect(page.locator('#expiryDateError')).toContainText('Fecha de vencimiento inválida');
    await expect(page.locator('#cvvError')).toContainText('CVV inválido');
    await expect(page.locator('#cardNameError')).toContainText('El nombre en la tarjeta es requerido');
    await expect(page.locator('#billingAddressError')).toContainText('La dirección de facturación es requerida');
    
    // Verificar que no aparezca mensaje de éxito
    await expect(page.locator('#results')).not.toBeVisible();
  });

  test('debería limpiar errores individuales al corregir campos', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Generar errores
    await page.click('button[type="submit"]');
    
    // Corregir un campo específico
    await page.fill('#firstName', 'Juan');
    
    // Verificar que solo ese error se limpie
    await expect(page.locator('#firstNameError')).toBeEmpty();
    await expect(page.locator('#firstName')).toHaveClass(/valid/);
    await expect(page.locator('#firstName')).not.toHaveClass(/error/);
    
    // Verificar que otros errores persistan
    await expect(page.locator('#lastNameError')).not.toBeEmpty();
    await expect(page.locator('#emailError')).not.toBeEmpty();
    await expect(page.locator('#lastName')).toHaveClass(/error/);
    await expect(page.locator('#email')).toHaveClass(/error/);
  });

  test('debería mostrar animación de error en campos inválidos', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Generar errores
    await page.click('button[type="submit"]');
    
    // Verificar que los campos tengan animación shake
    await expect(page.locator('#firstName')).toHaveClass(/shake/);
    await expect(page.locator('#lastName')).toHaveClass(/shake/);
    await expect(page.locator('#email')).toHaveClass(/shake/);
    
    // Esperar a que termine la animación
    await page.waitForTimeout(600);
    
    // Verificar que la animación termine
    await expect(page.locator('#firstName')).not.toHaveClass(/shake/);
    await expect(page.locator('#lastName')).not.toHaveClass(/shake/);
    await expect(page.locator('#email')).not.toHaveClass(/shake/);
  });

  test('debería mantener estado de error hasta que se corrija', async ({ page }) => {
    await page.click('[data-tab="contact"]');
    
    // Generar error
    await page.click('button[type="submit"]');
    await expect(page.locator('#contactNameError')).toContainText('El nombre es requerido');
    
    // Intentar enviar de nuevo sin corregir
    await page.click('button[type="submit"]');
    
    // Verificar que el error persista
    await expect(page.locator('#contactNameError')).toContainText('El nombre es requerido');
    await expect(page.locator('#contactName')).toHaveClass(/error/);
    
    // Corregir el campo
    await page.fill('#contactName', 'María García');
    
    // Verificar que el error se limpie
    await expect(page.locator('#contactNameError')).toBeEmpty();
    await expect(page.locator('#contactName')).toHaveClass(/valid/);
  });

  test('debería validar en tiempo real para confirmación de contraseña', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Llenar contraseña
    await page.fill('#password', 'password123');
    
    // Llenar confirmación incorrecta
    await page.fill('#confirmPassword', 'password456');
    
    // Verificar que aparezca error inmediatamente
    await expect(page.locator('#confirmPasswordError')).toContainText('Las contraseñas no coinciden');
    await expect(page.locator('#confirmPassword')).toHaveClass(/error/);
    
    // Corregir confirmación
    await page.fill('#confirmPassword', 'password123');
    
    // Verificar que el error se limpie
    await expect(page.locator('#confirmPasswordError')).toBeEmpty();
    await expect(page.locator('#confirmPassword')).toHaveClass(/valid/);
  });

  test('debería prevenir envío si hay errores de validación en tiempo real', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Llenar campos básicos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    
    // Llenar confirmación incorrecta (esto genera error en tiempo real)
    await page.fill('#confirmPassword', 'password456');
    
    // Intentar enviar
    await page.click('button[type="submit"]');
    
    // Verificar que no se envíe por el error de confirmación
    await expect(page.locator('#confirmPasswordError')).toContainText('Las contraseñas no coinciden');
    await expect(page.locator('#results')).not.toBeVisible();
  });

  test('debería mostrar mensaje de error específico para cada tipo de validación', async ({ page }) => {
    await page.click('[data-tab="checkout"]');
    
    // Probar diferentes tipos de errores de tarjeta
    await page.fill('#cardNumber', '1234'); // Muy corto
    await page.click('button[type="submit"]');
    await expect(page.locator('#cardNumberError')).toContainText('Número de tarjeta inválido');
    
    // Probar fecha expirada
    await page.fill('#expiryDate', '01/20'); // Fecha pasada
    await page.click('button[type="submit"]');
    await expect(page.locator('#expiryDateError')).toContainText('Fecha de vencimiento inválida o expirada');
    
    // Probar CVV con letras
    await page.fill('#cvv', 'abc');
    await page.click('button[type="submit"]');
    await expect(page.locator('#cvvError')).toContainText('CVV inválido');
  });

  test('debería mantener mensaje de error hasta completar corrección', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Generar error de email
    await page.fill('#email', 'email-malo');
    await page.click('button[type="submit"]');
    await expect(page.locator('#emailError')).toContainText('Formato de email inválido');
    
    // Corregir parcialmente
    await page.fill('#email', 'email@');
    await page.click('button[type="submit"]');
    await expect(page.locator('#emailError')).toContainText('Formato de email inválido');
    
    // Corregir completamente
    await page.fill('#email', 'email@ejemplo.com');
    await page.click('button[type="submit"]');
    await expect(page.locator('#emailError')).toBeEmpty();
    await expect(page.locator('#email')).toHaveClass(/valid/);
  });

  test('debería prevenir múltiples envíos mientras hay errores', async ({ page }) => {
    await page.click('[data-tab="contact"]');
    
    // Generar errores
    await page.click('button[type="submit"]');
    
    // Intentar enviar múltiples veces
    for (let i = 0; i < 3; i++) {
      await page.click('button[type="submit"]');
      await expect(page.locator('#contactNameError')).toContainText('El nombre es requerido');
      await expect(page.locator('#results')).not.toBeVisible();
    }
  });

  test('debería mostrar contador de errores en mensaje general', async ({ page }) => {
    await page.click('[data-tab="registration"]');
    
    // Generar exactamente 7 errores (todos los campos)
    await page.click('button[type="submit"]');
    
    // Verificar que el mensaje mencione el número correcto de errores
    await expect(page.locator('#resultMessage')).toContainText('Se encontraron 7 errores');
  });
});
