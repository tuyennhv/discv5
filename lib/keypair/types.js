export var KeypairType;
(function (KeypairType) {
    KeypairType[KeypairType["RSA"] = 0] = "RSA";
    KeypairType[KeypairType["Ed25519"] = 1] = "Ed25519";
    KeypairType[KeypairType["Secp256k1"] = 2] = "Secp256k1";
})(KeypairType || (KeypairType = {}));
export class AbstractKeypair {
    _privateKey;
    _publicKey;
    constructor(privateKey, publicKey) {
        if ((this._privateKey = privateKey) && !this.privateKeyVerify()) {
            throw new Error("Invalid private key");
        }
        if ((this._publicKey = publicKey) && !this.publicKeyVerify()) {
            throw new Error("Invalid private key");
        }
    }
    get privateKey() {
        if (!this._privateKey) {
            throw new Error();
        }
        return this._privateKey;
    }
    get publicKey() {
        if (!this._publicKey) {
            throw new Error();
        }
        return this._publicKey;
    }
    privateKeyVerify() {
        return true;
    }
    publicKeyVerify() {
        return true;
    }
    hasPrivateKey() {
        return Boolean(this._privateKey);
    }
}
//# sourceMappingURL=types.js.map