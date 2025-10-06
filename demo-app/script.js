// Demo de validaciones y manejo de errores para Playwright
class FormValidator {
    constructor() {
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupForms();
        this.setupEventListeners();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remover clase active de todos los tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Activar tab seleccionado
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Ocultar resultados
                document.getElementById('results').style.display = 'none';
            });
        });
    }

    setupForms() {
        this.setupRegistrationForm();
        this.setupContactForm();
        this.setupCheckoutForm();
    }

    setupRegistrationForm() {
        const form = document.getElementById('registrationForm');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');

        // Validación en tiempo real para confirmación de contraseña
        confirmPassword.addEventListener('input', () => {
            this.validatePasswordMatch(password, confirmPassword);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistrationSubmit(form);
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        const message = document.getElementById('message');
        const messageCount = document.getElementById('messageCount');

        // Contador de caracteres en tiempo real
        message.addEventListener('input', () => {
            const count = message.value.length;
            messageCount.textContent = count;
            
            if (count > 500) {
                messageCount.style.color = '#e74c3c';
            } else if (count > 400) {
                messageCount.style.color = '#f39c12';
            } else {
                messageCount.style.color = '#666';
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(form);
        });
    }

    setupCheckoutForm() {
        const form = document.getElementById('checkoutForm');
        const cardNumber = document.getElementById('cardNumber');
        const expiryDate = document.getElementById('expiryDate');
        const cvv = document.getElementById('cvv');

        // Formateo automático de tarjeta
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        // Formateo de fecha de vencimiento
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // Solo números para CVV
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCheckoutSubmit(form);
        });
    }

    setupEventListeners() {
        // Botón de reset
        document.getElementById('resetForm').addEventListener('click', () => {
            this.resetAllForms();
        });
    }

    // Validaciones específicas
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 8;
    }

    validatePasswordMatch(password, confirmPassword) {
        const errorElement = document.getElementById('confirmPasswordError');
        if (password.value !== confirmPassword.value) {
            this.showError(confirmPassword, errorElement, 'Las contraseñas no coinciden');
            return false;
        } else {
            this.clearError(confirmPassword, errorElement);
            return true;
        }
    }

    validateCardNumber(cardNumber) {
        // Algoritmo de Luhn simplificado
        const cleaned = cardNumber.replace(/\s/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    validateExpiryDate(expiryDate) {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(expiryDate)) return false;
        
        const [month, year] = expiryDate.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const expYear = parseInt(year);
        const expMonth = parseInt(month);
        
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            return false;
        }
        
        return true;
    }

    validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }

    // Manejo de errores
    showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('valid');
        errorElement.textContent = message;
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }

    clearError(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorElement.textContent = '';
    }

    // Manejo de envío de formularios
    async handleRegistrationSubmit(form) {
        const formData = new FormData(form);
        const errors = [];

        // Validaciones
        const firstName = form.querySelector('#firstName');
        const lastName = form.querySelector('#lastName');
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');
        const confirmPassword = form.querySelector('#confirmPassword');
        const age = form.querySelector('#age');
        const terms = form.querySelector('#terms');

        // Validar nombre
        if (!firstName.value.trim()) {
            this.showError(firstName, document.getElementById('firstNameError'), 'El nombre es requerido');
            errors.push('Nombre requerido');
        } else {
            this.clearError(firstName, document.getElementById('firstNameError'));
        }

        // Validar apellido
        if (!lastName.value.trim()) {
            this.showError(lastName, document.getElementById('lastNameError'), 'El apellido es requerido');
            errors.push('Apellido requerido');
        } else {
            this.clearError(lastName, document.getElementById('lastNameError'));
        }

        // Validar email
        if (!email.value.trim()) {
            this.showError(email, document.getElementById('emailError'), 'El email es requerido');
            errors.push('Email requerido');
        } else if (!this.validateEmail(email.value)) {
            this.showError(email, document.getElementById('emailError'), 'Formato de email inválido');
            errors.push('Email inválido');
        } else {
            this.clearError(email, document.getElementById('emailError'));
        }

        // Validar contraseña
        if (!password.value) {
            this.showError(password, document.getElementById('passwordError'), 'La contraseña es requerida');
            errors.push('Contraseña requerida');
        } else if (!this.validatePassword(password.value)) {
            this.showError(password, document.getElementById('passwordError'), 'La contraseña debe tener al menos 8 caracteres');
            errors.push('Contraseña muy corta');
        } else {
            this.clearError(password, document.getElementById('passwordError'));
        }

        // Validar confirmación de contraseña
        if (!this.validatePasswordMatch(password, confirmPassword)) {
            errors.push('Contraseñas no coinciden');
        }

        // Validar edad
        const ageValue = parseInt(age.value);
        if (!age.value) {
            this.showError(age, document.getElementById('ageError'), 'La edad es requerida');
            errors.push('Edad requerida');
        } else if (ageValue < 18 || ageValue > 100) {
            this.showError(age, document.getElementById('ageError'), 'La edad debe estar entre 18 y 100 años');
            errors.push('Edad inválida');
        } else {
            this.clearError(age, document.getElementById('ageError'));
        }

        // Validar términos
        if (!terms.checked) {
            this.showError(terms, document.getElementById('termsError'), 'Debes aceptar los términos y condiciones');
            errors.push('Términos no aceptados');
        } else {
            this.clearError(terms, document.getElementById('termsError'));
        }

        // Mostrar resultado
        if (errors.length === 0) {
            await this.simulateSubmission('registration', 'Registro exitoso! Bienvenido a nuestra plataforma.');
        } else {
            this.showResult('error', `Se encontraron ${errors.length} errores. Por favor, corrígelos antes de continuar.`);
        }
    }

    async handleContactSubmit(form) {
        const errors = [];
        const contactName = form.querySelector('#contactName');
        const contactEmail = form.querySelector('#contactEmail');
        const subject = form.querySelector('#subject');
        const message = form.querySelector('#message');

        // Validaciones similares...
        if (!contactName.value.trim()) {
            this.showError(contactName, document.getElementById('contactNameError'), 'El nombre es requerido');
            errors.push('Nombre requerido');
        } else {
            this.clearError(contactName, document.getElementById('contactNameError'));
        }

        if (!contactEmail.value.trim()) {
            this.showError(contactEmail, document.getElementById('contactEmailError'), 'El email es requerido');
            errors.push('Email requerido');
        } else if (!this.validateEmail(contactEmail.value)) {
            this.showError(contactEmail, document.getElementById('contactEmailError'), 'Formato de email inválido');
            errors.push('Email inválido');
        } else {
            this.clearError(contactEmail, document.getElementById('contactEmailError'));
        }

        if (!subject.value) {
            this.showError(subject, document.getElementById('subjectError'), 'Debes seleccionar un asunto');
            errors.push('Asunto requerido');
        } else {
            this.clearError(subject, document.getElementById('subjectError'));
        }

        if (!message.value.trim()) {
            this.showError(message, document.getElementById('messageError'), 'El mensaje es requerido');
            errors.push('Mensaje requerido');
        } else if (message.value.length < 10) {
            this.showError(message, document.getElementById('messageError'), 'El mensaje debe tener al menos 10 caracteres');
            errors.push('Mensaje muy corto');
        } else {
            this.clearError(message, document.getElementById('messageError'));
        }

        if (errors.length === 0) {
            await this.simulateSubmission('contact', 'Mensaje enviado exitosamente. Te responderemos pronto.');
        } else {
            this.showResult('error', `Se encontraron ${errors.length} errores. Por favor, corrígelos antes de continuar.`);
        }
    }

    async handleCheckoutSubmit(form) {
        const errors = [];
        const cardNumber = form.querySelector('#cardNumber');
        const expiryDate = form.querySelector('#expiryDate');
        const cvv = form.querySelector('#cvv');
        const cardName = form.querySelector('#cardName');
        const billingAddress = form.querySelector('#billingAddress');

        // Validar número de tarjeta
        if (!cardNumber.value.trim()) {
            this.showError(cardNumber, document.getElementById('cardNumberError'), 'El número de tarjeta es requerido');
            errors.push('Número de tarjeta requerido');
        } else if (!this.validateCardNumber(cardNumber.value)) {
            this.showError(cardNumber, document.getElementById('cardNumberError'), 'Número de tarjeta inválido');
            errors.push('Número de tarjeta inválido');
        } else {
            this.clearError(cardNumber, document.getElementById('cardNumberError'));
        }

        // Validar fecha de vencimiento
        if (!expiryDate.value.trim()) {
            this.showError(expiryDate, document.getElementById('expiryDateError'), 'La fecha de vencimiento es requerida');
            errors.push('Fecha de vencimiento requerida');
        } else if (!this.validateExpiryDate(expiryDate.value)) {
            this.showError(expiryDate, document.getElementById('expiryDateError'), 'Fecha de vencimiento inválida o expirada');
            errors.push('Fecha de vencimiento inválida');
        } else {
            this.clearError(expiryDate, document.getElementById('expiryDateError'));
        }

        // Validar CVV
        if (!cvv.value.trim()) {
            this.showError(cvv, document.getElementById('cvvError'), 'El CVV es requerido');
            errors.push('CVV requerido');
        } else if (!this.validateCVV(cvv.value)) {
            this.showError(cvv, document.getElementById('cvvError'), 'CVV inválido (3-4 dígitos)');
            errors.push('CVV inválido');
        } else {
            this.clearError(cvv, document.getElementById('cvvError'));
        }

        // Validar nombre en tarjeta
        if (!cardName.value.trim()) {
            this.showError(cardName, document.getElementById('cardNameError'), 'El nombre en la tarjeta es requerido');
            errors.push('Nombre en tarjeta requerido');
        } else {
            this.clearError(cardName, document.getElementById('cardNameError'));
        }

        // Validar dirección
        if (!billingAddress.value.trim()) {
            this.showError(billingAddress, document.getElementById('billingAddressError'), 'La dirección de facturación es requerida');
            errors.push('Dirección requerida');
        } else {
            this.clearError(billingAddress, document.getElementById('billingAddressError'));
        }

        if (errors.length === 0) {
            await this.simulateSubmission('checkout', 'Pago procesado exitosamente. ¡Gracias por tu compra!');
        } else {
            this.showResult('error', `Se encontraron ${errors.length} errores. Por favor, corrígelos antes de continuar.`);
        }
    }

    // Simulación de envío
    async simulateSubmission(formType, successMessage) {
        const submitBtn = document.querySelector(`#${formType}Form .submit-btn`);
        const originalText = submitBtn.textContent;
        
        // Mostrar estado de carga
        submitBtn.textContent = 'Procesando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');

        // Mostrar resultado exitoso
        this.showResult('success', successMessage);
    }

    // Mostrar resultados
    showResult(type, message) {
        const resultsContainer = document.getElementById('results');
        const resultMessage = document.getElementById('resultMessage');
        
        resultMessage.textContent = message;
        resultMessage.className = `result-message ${type}`;
        resultsContainer.style.display = 'block';
        
        // Scroll a resultados
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset de formularios
    resetAllForms() {
        const forms = document.querySelectorAll('.demo-form');
        forms.forEach(form => {
            form.reset();
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('error', 'valid');
            });
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
            });
        });
        
        document.getElementById('results').style.display = 'none';
        document.getElementById('messageCount').textContent = '0';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator();
});

// Exponer funciones para pruebas de Playwright
window.FormValidator = FormValidator;
