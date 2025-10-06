// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Proceso de Compra', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab="checkout"]');
  });

  test('debería mostrar el formulario de checkout correctamente', async ({ page }) => {
    // Verificar que el formulario esté visible
    await expect(page.locator('#checkoutForm')).toBeVisible();
    
    // Verificar que todos los campos estén presentes
    await expect(page.locator('#cardNumber')).toBeVisible();
    await expect(page.locator('#expiryDate')).toBeVisible();
    await expect(page.locator('#cvv')).toBeVisible();
    await expect(page.locator('#cardName')).toBeVisible();
    await expect(page.locator('#billingAddress')).toBeVisible();
    await expect(page.locator('#saveCard')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('debería validar campos requeridos', async ({ page }) => {
    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]');
    
    // Verificar que aparezcan mensajes de error
    await expect(page.locator('#cardNumberError')).toContainText('El número de tarjeta es requerido');
    await expect(page.locator('#expiryDateError')).toContainText('La fecha de vencimiento es requerida');
    await expect(page.locator('#cvvError')).toContainText('El CVV es requerido');
    await expect(page.locator('#cardNameError')).toContainText('El nombre en la tarjeta es requerido');
    await expect(page.locator('#billingAddressError')).toContainText('La dirección de facturación es requerida');
    
    // Verificar que los campos tengan clase de error
    await expect(page.locator('#cardNumber')).toHaveClass(/error/);
    await expect(page.locator('#expiryDate')).toHaveClass(/error/);
    await expect(page.locator('#cvv')).toHaveClass(/error/);
    await expect(page.locator('#cardName')).toHaveClass(/error/);
    await expect(page.locator('#billingAddress')).toHaveClass(/error/);
  });

  test('debería formatear automáticamente el número de tarjeta', async ({ page }) => {
    const cardNumberField = page.locator('#cardNumber');
    
    // Escribir número sin espacios
    await cardNumberField.fill('1234567890123456');
    
    // Verificar que se formatee automáticamente
    await expect(cardNumberField).toHaveValue('1234 5678 9012 3456');
  });

  test('debería validar número de tarjeta usando algoritmo de Luhn', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Probar número de tarjeta inválido
    await page.fill('#cardNumber', '1234 5678 9012 3456');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#cardNumberError')).toContainText('Número de tarjeta inválido');
    await expect(page.locator('#cardNumber')).toHaveClass(/error/);
  });

  test('debería aceptar número de tarjeta válido', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Usar número de tarjeta válido (Visa de prueba)
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.click('button[type="submit"]');
    
    // Verificar que no haya error de tarjeta
    await expect(page.locator('#cardNumberError')).toBeEmpty();
    await expect(page.locator('#cardNumber')).toHaveClass(/valid/);
  });

  test('debería formatear automáticamente la fecha de vencimiento', async ({ page }) => {
    const expiryField = page.locator('#expiryDate');
    
    // Escribir fecha sin formato
    await expiryField.fill('1225');
    
    // Verificar que se formatee automáticamente
    await expect(expiryField).toHaveValue('12/25');
  });

  test('debería validar formato de fecha de vencimiento', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Probar fechas inválidas
    const invalidDates = ['13/25', '00/25', '12/20', 'ab/cd'];
    
    for (const date of invalidDates) {
      await page.fill('#expiryDate', date);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('#expiryDateError')).toContainText('Fecha de vencimiento inválida');
      await expect(page.locator('#expiryDate')).toHaveClass(/error/);
    }
  });

  test('debería aceptar fecha de vencimiento válida', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Usar fecha válida
    await page.fill('#expiryDate', '12/25');
    await page.click('button[type="submit"]');
    
    // Verificar que no haya error de fecha
    await expect(page.locator('#expiryDateError')).toBeEmpty();
    await expect(page.locator('#expiryDate')).toHaveClass(/valid/);
  });

  test('debería validar formato de CVV', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Probar CVVs inválidos
    const invalidCVVs = ['12', '12345', 'abc', '12a'];
    
    for (const cvv of invalidCVVs) {
      await page.fill('#cvv', cvv);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('#cvvError')).toContainText('CVV inválido');
      await expect(page.locator('#cvv')).toHaveClass(/error/);
    }
  });

  test('debería aceptar CVV válido', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Usar CVV válido
    await page.fill('#cvv', '123');
    await page.click('button[type="submit"]');
    
    // Verificar que no haya error de CVV
    await expect(page.locator('#cvvError')).toBeEmpty();
    await expect(page.locator('#cvv')).toHaveClass(/valid/);
  });

  test('debería validar nombre en la tarjeta', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Probar nombre vacío
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#cardNameError')).toContainText('El nombre en la tarjeta es requerido');
    await expect(page.locator('#cardName')).toHaveClass(/error/);
  });

  test('debería validar dirección de facturación', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    
    // Probar dirección vacía
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#billingAddressError')).toContainText('La dirección de facturación es requerida');
    await expect(page.locator('#billingAddress')).toHaveClass(/error/);
  });

  test('debería permitir pago exitoso con datos válidos', async ({ page }) => {
    // Llenar formulario con datos válidos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad, País');
    await page.check('#saveCard');
    
    // Enviar formulario
    await page.click('button[type="submit"]');
    
    // Verificar que aparezca el mensaje de éxito
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#resultMessage')).toContainText('Pago procesado exitosamente');
    await expect(page.locator('#resultMessage')).toHaveClass(/success/);
    
    // Verificar que los campos tengan clase de validación
    await expect(page.locator('#cardNumber')).toHaveClass(/valid/);
    await expect(page.locator('#expiryDate')).toHaveClass(/valid/);
    await expect(page.locator('#cvv')).toHaveClass(/valid/);
    await expect(page.locator('#cardName')).toHaveClass(/valid/);
    await expect(page.locator('#billingAddress')).toHaveClass(/valid/);
  });

  test('debería mostrar estado de carga durante procesamiento', async ({ page }) => {
    // Llenar formulario con datos válidos
    await page.fill('#cardNumber', '4111 1111 1111 1111');
    await page.fill('#expiryDate', '12/25');
    await page.fill('#cvv', '123');
    await page.fill('#cardName', 'Juan Pérez');
    await page.fill('#billingAddress', 'Calle Principal 123, Ciudad');
    
    // Enviar formulario y verificar estado de carga
    await page.click('button[type="submit"]');
    
    // Verificar que el botón muestre estado de carga
    await expect(page.locator('button[type="submit"]')).toContainText('Procesando...');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toHaveClass(/loading/);
  });

  test('debería permitir guardar información de tarjeta', async ({ page }) => {
    const saveCardCheckbox = page.locator('#saveCard');
    
    // Verificar que el checkbox no esté marcado por defecto
    await expect(saveCardCheckbox).not.toBeChecked();
    
    // Marcar el checkbox
    await saveCardCheckbox.check();
    await expect(saveCardCheckbox).toBeChecked();
    
    // Desmarcar el checkbox
    await saveCardCheckbox.uncheck();
    await expect(saveCardCheckbox).not.toBeChecked();
  });

  test('debería limpiar errores al corregir campos', async ({ page }) => {
    // Generar errores
    await page.click('button[type="submit"]');
    
    // Corregir un campo
    await page.fill('#cardName', 'Juan Pérez');
    
    // Verificar que el error se limpie
    await expect(page.locator('#cardNameError')).toBeEmpty();
    await expect(page.locator('#cardName')).toHaveClass(/valid/);
    await expect(page.locator('#cardName')).not.toHaveClass(/error/);
  });

  test('debería rechazar caracteres no numéricos en CVV', async ({ page }) => {
    const cvvField = page.locator('#cvv');
    
    // Intentar escribir caracteres no numéricos
    await cvvField.fill('abc');
    
    // Verificar que solo se permitan números
    await expect(cvvField).toHaveValue('');
    
    // Escribir números
    await cvvField.fill('123');
    await expect(cvvField).toHaveValue('123');
  });
});
