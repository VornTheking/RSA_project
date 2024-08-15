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

// Helper function to convert alphabetic characters to numbers (starting from 0)
function charToNum(char) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet.indexOf(char.toLowerCase());
}

// Helper function to convert numbers back to alphabetic characters (starting from 0)
function numToChar(num) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    return alphabet[num];
}

// Function to calculate the greatest common divisor (GCD)
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Extended Euclidean Algorithm to find the modular inverse of e modulo phi
function modInverse(e, phi) {
    let [a, b, u] = [0, phi, 1];
    while (e > 0) {
        const q = Math.floor(b / e);
        [e, a, b, u] = [b % e, u, e, a - q * u];
    }
    if (b === 1) return a + phi;
    throw new Error('Modular inverse does not exist');
}

// RSA encryption function
function encrypt(message, e, n) {
    // Split the message into pairs of characters
    const pairs = message.match(/.{1,2}/g) || [];

    return pairs.map(pair => {
        // Convert pair to a number by concatenating their alphabetic index values
        const num = pair.split('').map(charToNum).map(n => n.toString().padStart(2, '0')).join('');
        const encryptedNum = modExp(parseInt(num), e, n);
        return encryptedNum;
    }).join(' ');
}

// RSA decryption function
function decrypt(ciphertext, d, n) {
    // Split the ciphertext into pairs of encrypted numbers
    const pairs = ciphertext.split(' ');

    return pairs.map(pair => {
        // Decrypt the pair and split the resulting number back into characters
        const decryptedNum = modExp(parseInt(pair), d, n);
        const decryptedStr = decryptedNum.toString().padStart(4, '0'); // Ensure 4 digits
        const chars = decryptedStr.match(/.{1,2}/g).map(num => numToChar(parseInt(num)));
        return chars.join('');
    }).join('');
}

document.getElementById('encryptBtn').addEventListener('click', function() {
    const message = document.getElementById('message').value;
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const e = parseInt(document.getElementById('e').value);

    if (!message || isNaN(p) || isNaN(q) || isNaN(e)) {
        alert('Please enter a message and valid p, q, and e values');
        return;
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    try {
        const d = modInverse(e, phi); // Calculate d dynamically
        const ciphertext = encrypt(message, e, n);

        document.getElementById('encryptedMessage').textContent = ciphertext;
        document.getElementById('keysInfo').textContent = `p = ${p} , q = ${q} , n = ${n}, Public key = {${e} , ${n}} , Private key = {${d} , ${n}}`;
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('decryptBtn').addEventListener('click', function() {
    const ciphertext = document.getElementById('encryptedMessage').textContent;
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const e = parseInt(document.getElementById('e').value);

    if (!ciphertext || isNaN(p) || isNaN(q) || isNaN(e)) {
        alert('Please ensure there is an encrypted message and valid p, q, and e values');
        return;
    }

    const n = p * q;
    const phi = (p - 1) * (q - 1);

    try {
        const d = modInverse(e, phi); // Calculate d dynamically
        const decryptedMessage = decrypt(ciphertext, d, n);

        document.getElementById('decryptedMessage').textContent = decryptedMessage;
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('resetBtn').addEventListener('click', function() {
    document.getElementById('message').value = '';
    document.getElementById('p').value = '';
    document.getElementById('q').value = '';
    document.getElementById('e').value = '';
    document.getElementById('encryptedMessage').textContent = '';
    document.getElementById('decryptedMessage').textContent = '';
    document.getElementById('keysInfo').textContent = '';
});
