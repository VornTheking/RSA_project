// script.js

// Helper function to perform modular exponentiation
function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

function encrypt(message, e, n) {
    return message.split('').map(char => {
        return modExp(char.charCodeAt(0), e, n);
    }).join(' ');
}

function decrypt(ciphertext, d, n) {
    return ciphertext.split(' ').map(num => {
        return String.fromCharCode(modExp(parseInt(num), d, n));
    }).join('');
}

document.getElementById('encryptBtn').addEventListener('click', function() {
    const message = document.getElementById('message').value;

    // Automatically set p, q, and e values
    const p = 61;
    const q = 53;
    const e = 17;

    if (!message) {
        alert('Please enter a message to encrypt');
        return;
    }

    const n = p * q;
    const d = 2753; // Private exponent for example, adjust as needed

    const ciphertext = encrypt(message, e, n);

    document.getElementById('encryptedMessage').textContent = ciphertext;
    document.getElementById('keysInfo').textContent = `p = ${p} , q = ${q} , n = ${n}, Public key = {${e} , ${n}} , Private key = {${d} , ${n}}`;
});

document.getElementById('decryptBtn').addEventListener('click', function() {
    const ciphertext = document.getElementById('encryptedMessage').textContent;

    // Automatically set p and q values
    const p = 61;
    const q = 53;

    if (!ciphertext) {
        alert('No encrypted message to decrypt');
        return;
    }

    const n = p * q;
    const d = 2753; // Private exponent for example, adjust as needed

    const decryptedMessage = decrypt(ciphertext, d, n);

    document.getElementById('decryptedMessage').textContent = decryptedMessage;
});

document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('message').value = '';
    document.getElementById('encryptedMessage').textContent = '';
    document.getElementById('decryptedMessage').textContent = '';
    document.getElementById('keysInfo').textContent = '';
});
