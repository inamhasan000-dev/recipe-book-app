import CryptoJS from 'crypto-js';

// Encrypt with salt and IV
export function encryptSecure(text, passphrase) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(passphrase, salt, {
        keySize: 256 / 32,
        iterations: 1000,
    });

    const encrypted = CryptoJS.AES.encrypt(text, key, { iv });

    // Return a string with salt + iv + ciphertext (Base64 encoded)
    return CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));
}
export function decryptSecure(encryptedBase64, passphrase) {
    const encrypted = CryptoJS.enc.Base64.parse(encryptedBase64);

    const totalBytes = encrypted.sigBytes;
    const saltBytes = 16;
    const ivBytes = 16;

    const salt = CryptoJS.lib.WordArray.create(
        encrypted.words.slice(0, saltBytes / 4),
        saltBytes
    );
    const iv = CryptoJS.lib.WordArray.create(
        encrypted.words.slice(saltBytes / 4, (saltBytes + ivBytes) / 4),
        ivBytes
    );
    const ciphertext = CryptoJS.lib.WordArray.create(
        encrypted.words.slice((saltBytes + ivBytes) / 4),
        totalBytes - saltBytes - ivBytes
    );

    const key = CryptoJS.PBKDF2(passphrase, salt, {
        keySize: 256 / 32,
        iterations: 1000,
    });

    const decrypted = CryptoJS.AES.decrypt({ ciphertext }, key, { iv });

    return decrypted.toString(CryptoJS.enc.Utf8);
}


