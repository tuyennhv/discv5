import cipher from "bcrypto/lib/cipher.js";
export function aesCtrEncrypt(key, iv, pt) {
    const ctx = new cipher.Cipher("AES-128-CTR");
    ctx.init(key, iv);
    ctx.update(pt);
    return ctx.final();
}
export function aesCtrDecrypt(key, iv, pt) {
    const ctx = new cipher.Decipher("AES-128-CTR");
    ctx.init(key, iv);
    ctx.update(pt);
    return ctx.final();
}
//# sourceMappingURL=crypto.js.map