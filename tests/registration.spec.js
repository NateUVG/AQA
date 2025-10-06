// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Formulario de Registro', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab="registration"]');
  });

  test('debería mostrar el formulario de registro correctamente', async ({ page }) => {
    // Verificar que el formulario esté visible
    await expect(page.locator('#registrationForm')).toBeVisible();
    
    // Verificar que todos los campos estén presentes
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#lastName')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
    await expect(page.locator('#age')).toBeVisible();
    await expect(page.locator('#terms')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('debería validar campos requeridos', async ({ page }) => {
    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]');
    
    // Verificar que aparezcan mensajes de error
    await expect(page.locator('#firstNameError')).toContainText('El nombre es requerido');
    await expect(page.locator('#lastNameError')).toContainText('El apellido es requerido');
    await expect(page.locator('#emailError')).toContainText('El email es requerido');
    await expect(page.locator('#passwordError')).toContainText('La contraseña es requerida');
    await expect(page.locator('#ageError')).toContainText('La edad es requerida');
    await expect(page.locator('#termsError')).toContainText('Debes aceptar los términos');
    
    // Verificar que los campos tengan clase de error
    await expect(page.locator('#firstName')).toHaveClass(/error/);
    await expect(page.locator('#lastName')).toHaveClass(/error/);
    await expect(page.locator('#email')).toHaveClass(/error/);
    await expect(page.locator('#password')).toHaveClass(/error/);
    await expect(page.locator('#age')).toHaveClass(/error/);
  });

  test('debería validar formato de email', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    
    // Probar emails inválidos
    const invalidEmails = ['email-invalido', '@dominio.com', 'usuario@', 'usuario@dominio'];
    
    for (const email of invalidEmails) {
      await page.fill('#email', email);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('#emailError')).toContainText('Formato de email inválido');
      await expect(page.locator('#email')).toHaveClass(/error/);
    }
  });

  test('debería validar longitud mínima de contraseña', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#age', '25');
    await page.check('#terms');
    
    // Probar contraseña muy corta
    await page.fill('#password', '123');
    await page.fill('#confirmPassword', '123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#passwordError')).toContainText('La contraseña debe tener al menos 8 caracteres');
    await expect(page.locator('#password')).toHaveClass(/error/);
  });

  test('debería validar que las contraseñas coincidan', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#age', '25');
    await page.check('#terms');
    
    // Probar contraseñas que no coinciden
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password456');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#confirmPasswordError')).toContainText('Las contraseñas no coinciden');
    await expect(page.locator('#confirmPassword')).toHaveClass(/error/);
  });

  test('debería validar rango de edad', async ({ page }) => {
    // Llenar campos básicos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.check('#terms');
    
    // Probar edad menor a 18
    await page.fill('#age', '17');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#ageError')).toContainText('La edad debe estar entre 18 y 100 años');
    await expect(page.locator('#age')).toHaveClass(/error/);
    
    // Probar edad mayor a 100
    await page.fill('#age', '101');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#ageError')).toContainText('La edad debe estar entre 18 y 100 años');
    await expect(page.locator('#age')).toHaveClass(/error/);
  });

  test('debería validar aceptación de términos', async ({ page }) => {
    // Llenar todos los campos excepto términos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('#termsError')).toContainText('Debes aceptar los términos y condiciones');
  });

  test('debería permitir registro exitoso con datos válidos', async ({ page }) => {
    // Llenar formulario con datos válidos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    
    // Enviar formulario
    await page.click('button[type="submit"]');
    
    // Verificar que aparezca el mensaje de éxito
    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#resultMessage')).toContainText('Registro exitoso');
    await expect(page.locator('#resultMessage')).toHaveClass(/success/);
    
    // Verificar que los campos tengan clase de validación
    await expect(page.locator('#firstName')).toHaveClass(/valid/);
    await expect(page.locator('#lastName')).toHaveClass(/valid/);
    await expect(page.locator('#email')).toHaveClass(/valid/);
    await expect(page.locator('#password')).toHaveClass(/valid/);
    await expect(page.locator('#confirmPassword')).toHaveClass(/valid/);
    await expect(page.locator('#age')).toHaveClass(/valid/);
  });

  test('debería mostrar animación de error en campos inválidos', async ({ page }) => {
    // Intentar enviar formulario vacío
    await page.click('button[type="submit"]');
    
    // Verificar que los campos tengan la animación shake
    await expect(page.locator('#firstName')).toHaveClass(/shake/);
    await expect(page.locator('#lastName')).toHaveClass(/shake/);
    await expect(page.locator('#email')).toHaveClass(/shake/);
  });

  test('debería limpiar errores al corregir campos', async ({ page }) => {
    // Generar errores
    await page.click('button[type="submit"]');
    
    // Corregir un campo
    await page.fill('#firstName', 'Juan');
    
    // Verificar que el error se limpie
    await expect(page.locator('#firstNameError')).toBeEmpty();
    await expect(page.locator('#firstName')).toHaveClass(/valid/);
    await expect(page.locator('#firstName')).not.toHaveClass(/error/);
  });

  test('debería mostrar estado de carga durante envío', async ({ page }) => {
    // Llenar formulario con datos válidos
    await page.fill('#firstName', 'Juan');
    await page.fill('#lastName', 'Pérez');
    await page.fill('#email', 'juan@ejemplo.com');
    await page.fill('#password', 'password123');
    await page.fill('#confirmPassword', 'password123');
    await page.fill('#age', '25');
    await page.check('#terms');
    
    // Enviar formulario y verificar estado de carga
    await page.click('button[type="submit"]');
    
    // Verificar que el botón muestre estado de carga
    await expect(page.locator('button[type="submit"]')).toContainText('Procesando...');
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toHaveClass(/loading/);
  });
});
