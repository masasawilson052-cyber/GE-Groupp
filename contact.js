// Wait for the DOM to be fully loaded before running the code inside
document.addEventListener('DOMContentLoaded', () => {
    // Enable strict mode to catch common coding mistakes and unsafe actions
    'use strict';

    // Find the first element with class 'contact-form' (our form)
    const form = document.querySelector('.contact-form');
    // If the form doesn't exist on the page, stop executing this script
    if (!form) return;

    // Try to find the name input – look for an element with id="name" OR name="name"
    const nameInput = form.querySelector('#name, input[name="name"]');
    // Try to find the email input – id="email" OR name="email"
    const emailInput = form.querySelector('#email, input[name="email"]');
    // Try to find the message input – id="message" OR textarea with name="message"
    const msgInput = form.querySelector('#message, textarea[name="message"]');
    
    // Helper function to create a small error message span next to a form field
    const createErrorSpan = (field) => {
        // Find the closest parent with class 'form-group' or fallback to the direct parent element
        const parent = field.closest('.form-group') || field.parentElement;
        // Try to find an existing error span inside that parent
        let err = parent.querySelector('.error');
        // If no error span exists yet, create one
        if (!err) {
            err = document.createElement('span');       // Create a new <span> element
            err.className = 'error';                    // Give it the class 'error'
            // Apply inline CSS styles: red color, small font, block display, etc.
            err.style.cssText = 'color: #e11d48; font-size: 0.75rem; display: block; margin-top: 4px; font-weight: 500;';
            parent.appendChild(err);                    // Add the error span to the parent container
        }
        return err;  // Return the error span (either existing or newly created)
    };
    // Create (or get) an error span for the name input field
    const nameErr = createErrorSpan(nameInput);
    // Create (or get) an error span for the email input field
    const emailErr = createErrorSpan(emailInput);
    // Create (or get) an error span for the message input field
    const msgErr = createErrorSpan(msgInput);
    
    // Regular expression to validate email format:
    // ^[^\s@]+  → starts with one or more characters that are not space or @
    // @         → literal @ symbol
    // ([^\s@]+\.)+ → domain part (at least one dot, no spaces or @)
    // [^\s@]+$  → ends with valid characters (no spaces or @)
    const isValidEmail = (email) => /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(email);
    
    // Function to clear all previous error messages and remove error styling from inputs
    const clearErrors = () => {
        // Loop through all three error spans and set their text content to empty string
        [nameErr, emailErr, msgErr].forEach(e => e.textContent = '');
        // Remove the 'error-input' class from all three input fields (if they exist)
        [nameInput, emailInput, msgInput].forEach(i => i?.classList.remove('error-input'));
    };
    
    // Main validation function – checks all fields and returns true if all valid
    const validate = () => {
        let valid = true;            // Assume the form is valid initially
        clearErrors();               // Remove any old error messages before showing new ones
        
        // --- Validate name field ---
        if (!nameInput.value.trim()) {   // If name is empty or only whitespace
            nameErr.textContent = '❌ Name is required';   // Show required error
            nameInput.classList.add('error-input');        // Add red border / error styling
            valid = false;               // Mark form as invalid
        } else if (nameInput.value.trim().length < 2) {   // If name is too short (less than 2 chars)
            nameErr.textContent = '❌ Name must be at least 2 characters';
            nameInput.classList.add('error-input');
            valid = false;
        }
        
        // --- Validate email field ---
        const email = emailInput.value.trim();   // Get trimmed email value
        if (!email) {                            // If email is empty
            emailErr.textContent = '❌ Email required';
            emailInput.classList.add('error-input');
            valid = false;
        } else if (!isValidEmail(email)) {       // If email does not match regex pattern
            emailErr.textContent = '❌ Invalid email (e.g., name@domain.com)';
            emailInput.classList.add('error-input');
            valid = false;
        }
        
        // --- Validate message field ---
        if (!msgInput.value.trim()) {            // If message is empty or only spaces
            msgErr.textContent = '❌ Message cannot be empty';
            msgInput.classList.add('error-input');
            valid = false;
        } else if (msgInput.value.trim().length < 5) {   // If message length is less than 5 characters
            msgErr.textContent = '❌ Message too short (min 5 chars)';
            msgInput.classList.add('error-input');
            valid = false;
        }
        
        return valid;   // Return true if all checks passed, otherwise false
    };
    
    // Add submit event listener to the form
    form.addEventListener('submit', (e) => {
        e.preventDefault();          // Prevent the default form submission (page reload)
        if (validate()) {            // Only proceed if all fields are valid
            // Create a temporary success message div
            const successDiv = document.createElement('div');
            successDiv.className = 'success-msg';      // Give it a class name for possible CSS
            successDiv.textContent = '✅ Message sent successfully! ';   // Set the message text
            // Apply inline styles to make it look like a green alert box
            successDiv.style.cssText = 'background: #10b981; color: white; padding: 10px; border-radius: 12px; text-align: center; margin-top: 15px;';
            form.appendChild(successDiv);              // Add the success message inside the form
            form.reset();                              // Clear all form fields
            setTimeout(() => successDiv.remove(), 4000); // Automatically remove the message after 4 seconds
        }
    });
    
    // Add "real-time" validation when the user leaves each field (blur event)
    [nameInput, emailInput, msgInput].forEach(field => 
        field?.addEventListener('blur', validate)   // If field exists, run validate() on blur
    );
});