// DOM Elements
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generateBtn = document.getElementById('generate');
const copyBtns = document.querySelectorAll('.copy-btn');
const passwordInputs = [
    document.getElementById('password1'),
    document.getElementById('password2'),
    document.getElementById('password3'),
    document.getElementById('password4'),
    document.getElementById('password5')
];

// Character sets
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

// Event Listeners
lengthSlider.addEventListener('input', updateLengthValue);
generateBtn.addEventListener('click', generatePasswords);
copyBtns.forEach(btn => {
    btn.addEventListener('click', copyPassword);
});

// Initialize the app
function init() {
    updateLengthValue();
    generatePasswords();
}

// Update the displayed length value
function updateLengthValue() {
    lengthValue.textContent = lengthSlider.value;
}

// Generate a single password
function generatePassword() {
    let chars = '';
    let password = '';
    
    // Validate at least one character set is selected
    if (uppercaseCheckbox.checked) chars += uppercaseChars;
    if (lowercaseCheckbox.checked) chars += lowercaseChars;
    if (numbersCheckbox.checked) chars += numberChars;
    if (symbolsCheckbox.checked) chars += symbolChars;
    
    // Default to lowercase if nothing is selected
    if (chars === '') {
        chars = lowercaseChars;
        lowercaseCheckbox.checked = true;
    }
    
    const length = parseInt(lengthSlider.value);
    
    // Generate password
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    
    // Ensure password has at least one character from each selected character set
    let finalPassword = password;
    if (length >= 4) {
        finalPassword = ensureCharacterTypes(password);
    }
    
    return finalPassword;
}

// Ensure password contains at least one of each selected character type
function ensureCharacterTypes(password) {
    let result = password;
    const length = result.length;
    let positions = [];
    
    // Create array of positions to potentially replace
    for (let i = 0; i < length; i++) {
        positions.push(i);
    }
    
    // Shuffle positions
    positions = shuffleArray(positions);
    
    let posIndex = 0;
    
    // Add uppercase if needed
    if (uppercaseCheckbox.checked && !/[A-Z]/.test(result)) {
        const randomChar = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        result = replaceCharAt(result, positions[posIndex], randomChar);
        posIndex++;
    }
    
    // Add lowercase if needed
    if (lowercaseCheckbox.checked && !/[a-z]/.test(result)) {
        const randomChar = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        result = replaceCharAt(result, positions[posIndex], randomChar);
        posIndex++;
    }
    
    // Add number if needed
    if (numbersCheckbox.checked && !/[0-9]/.test(result)) {
        const randomChar = numberChars[Math.floor(Math.random() * numberChars.length)];
        result = replaceCharAt(result, positions[posIndex], randomChar);
        posIndex++;
    }
    
    // Add symbol if needed
    if (symbolsCheckbox.checked && !/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(result)) {
        const randomChar = symbolChars[Math.floor(Math.random() * symbolChars.length)];
        result = replaceCharAt(result, positions[posIndex], randomChar);
    }
    
    return result;
}

// Replace character at specific position
function replaceCharAt(str, index, character) {
    return str.substring(0, index) + character + str.substring(index + 1);
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate all passwords
function generatePasswords() {
    for (let i = 0; i < passwordInputs.length; i++) {
        passwordInputs[i].value = generatePassword();
    }
    
    // Reset copy button texts
    copyBtns.forEach(btn => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
    });
}

// Copy password to clipboard
function copyPassword(e) {
    const targetId = e.target.getAttribute('data-target');
    const passwordInput = document.getElementById(targetId);
    
    // Select the text
    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy to clipboard
    navigator.clipboard.writeText(passwordInput.value)
        .then(() => {
            // Update button text temporarily
            e.target.textContent = 'Copied!';
            e.target.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                e.target.textContent = 'Copy';
                e.target.classList.remove('copied');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy password');
        });
}

// Initialize the app when the page loads
window.addEventListener('load', init);