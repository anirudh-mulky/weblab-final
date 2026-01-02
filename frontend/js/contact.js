document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const clearBtn = document.getElementById('clear-form-btn');
  const emailInput = document.getElementById('email');
  const mobileInput = document.getElementById('mobile');

  function clearForm() {
    if (emailInput) {
      emailInput.value = '';
      emailInput.classList.remove('error');
    }
    if (mobileInput) {
      mobileInput.value = '';
      mobileInput.classList.remove('error');
    }
    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    if (typeof showNotification === 'function') {
      showNotification('Form cleared', 'info');
    }
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateMobile(mobile) {
    const mobileRegex = /^[\d\s\-\+\(\)]+$/;
    return mobileRegex.test(mobile) && mobile.replace(/\D/g, '').length >= 10;
  }

  function showFieldError(input, message) {
    input.classList.add('error');
    
    let errorMsg = input.parentElement.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('span');
      errorMsg.className = 'error-message';
      input.parentElement.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
  }

  function removeFieldError(input) {
    input.classList.remove('error');
    const errorMsg = input.parentElement.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearForm();
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      removeFieldError(emailInput);
    });

    emailInput.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      if (email && !validateEmail(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
      }
    });
  }

  if (mobileInput) {
    mobileInput.addEventListener('input', () => {
      removeFieldError(mobileInput);
    });

    mobileInput.addEventListener('blur', () => {
      const mobile = mobileInput.value.trim();
      if (mobile && !validateMobile(mobile)) {
        showFieldError(mobileInput, 'Please enter a valid mobile number (at least 10 digits)');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      const mobile = mobileInput.value.trim();
      
      let hasErrors = false;

      if (!email) {
        showFieldError(emailInput, 'Email address is required');
        hasErrors = true;
      } else if (!validateEmail(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        hasErrors = true;
      } else {
        removeFieldError(emailInput);
      }

      if (!mobile) {
        showFieldError(mobileInput, 'Mobile number is required');
        hasErrors = true;
      } else if (!validateMobile(mobile)) {
        showFieldError(mobileInput, 'Please enter a valid mobile number (at least 10 digits)');
        hasErrors = true;
      } else {
        removeFieldError(mobileInput);
      }

      if (hasErrors) {
        if (typeof showNotification === 'function') {
          showNotification('Please correct the errors before submitting', 'error');
        } else {
          alert('Please correct the errors before submitting');
        }
        return;
      }

      if (typeof showNotification === 'function') {
        showNotification('Thank you! We will contact you soon.', 'success');
      } else {
        alert('Thank you! We will contact you soon.');
      }
      
      contactForm.reset();
    });
  }
});

