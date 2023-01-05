import keccak from "bcrypto/lib/keccak.js";
import secp256k1 from "bcrypto/lib/secp256k1.js";
import { createNodeId } from "./create.js";
export function hash(input) {
    return keccak.digest(input);
}
export function createPrivateKey() {
    return secp256k1.privateKeyGenerate();
}
export function publicKey(privKey) {
    return secp256k1.publicKeyCreate(privKey);
}
export function sign(privKey, msg) {
    return secp256k1.sign(hash(msg), privKey);
}
export function verify(pubKey, msg, sig) {
    return secp256k1.verify(hash(msg), sig, pubKey);
}
export function nodeId(pubKey) {
    return createNodeId(hash(secp256k1.publicKeyConvert(pubKey, false).slice(1)));
}
export class ENRKeyPair {
    nodeId;
    privateKey;
    publicKey;
    constructor(privateKey) {
        if (privateKey) {
            if (!secp256k1.privateKeyVerify(privateKey)) {
                throw new Error("Invalid private key");
            }
        }
        this.privateKey = privateKey || createPrivateKey();
        this.publicKey = publicKey(this.privateKey);
        this.nodeId = nodeId(this.publicKey);
    }
    sign(msg) {
        return sign(this.privateKey, msg);
    }
    verify(msg, sig) {
        return verify(this.publicKey, msg, sig);
    }
}
//# sourceMappingURL=v4.js.map