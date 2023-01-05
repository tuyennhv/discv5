import hkdf from "bcrypto/lib/hkdf.js";
import sha256 from "bcrypto/lib/sha256.js";
import cipher from "bcrypto/lib/cipher.js";
import { generateKeypair, createKeypair } from "../keypair/index.js";
import { fromHex } from "../util/index.js";
import { getNodeId, getPublicKey } from "./nodeInfo.js";
// Implementation for generating session keys in the Discv5 protocol.
// Currently, Diffie-Hellman key agreement is performed with known public key types. Session keys
// are then derived using the HKDF (SHA2-256) key derivation function.
//
// There is no abstraction in this module as the specification explicitly defines a singular
// encryption and key-derivation algorithms. Future versions may abstract some of these to allow
// for different algorithms.
const KEY_AGREEMENT_STRING = "discovery v5 key agreement";
const ID_SIGNATURE_TEXT = "discovery v5 identity proof";
const KEY_LENGTH = 16;
export const MAC_LENGTH = 16;
// Generates session keys for a challengeData and remote ENR. This currently only
// supports Secp256k1 signed ENR's.
// Returns [initiatorKey, responderKey, ephemPK]
export function generateSessionKeys(localId, remoteContact, challengeData) {
    const remoteKeypair = getPublicKey(remoteContact);
    const ephemKeypair = generateKeypair(remoteKeypair.type);
    const secret = ephemKeypair.deriveSecret(remoteKeypair);
    /* TODO possibly not needed, check tests
    const ephemPubkey =
      remoteKeypair.type === KeypairType.secp256k1
        ? secp256k1PublicKeyToCompressed(ephemKeypair.publicKey)
        : ephemKeypair.publicKey;
    */
    return [...deriveKey(secret, localId, getNodeId(remoteContact), challengeData), ephemKeypair.publicKey];
}
export function deriveKey(secret, firstId, secondId, challengeData) {
    const info = Buffer.concat([Buffer.from(KEY_AGREEMENT_STRING), fromHex(firstId), fromHex(secondId)]);
    const output = hkdf.expand(sha256, hkdf.extract(sha256, secret, challengeData), info, 2 * KEY_LENGTH);
    return [output.slice(0, KEY_LENGTH), output.slice(KEY_LENGTH, 2 * KEY_LENGTH)];
}
export function deriveKeysFromPubkey(kpriv, localId, remoteId, ephemPK, challengeData) {
    const secret = kpriv.deriveSecret(createKeypair(kpriv.type, undefined, ephemPK));
    return deriveKey(secret, remoteId, localId, challengeData);
}
// Generates a signature given a keypair.
export function idSign(kpriv, challengeData, ephemPK, destNodeId) {
    const signingNonce = generateIdSignatureInput(challengeData, ephemPK, destNodeId);
    return kpriv.sign(signingNonce);
}
// Verifies the id signature
export function idVerify(kpub, challengeData, remoteEphemPK, srcNodeId, sig) {
    const signingNonce = generateIdSignatureInput(challengeData, remoteEphemPK, srcNodeId);
    return kpub.verify(signingNonce, sig);
}
export function generateIdSignatureInput(challengeData, ephemPK, nodeId) {
    return sha256.digest(Buffer.concat([Buffer.from(ID_SIGNATURE_TEXT), challengeData, ephemPK, fromHex(nodeId)]));
}
export function decryptMessage(key, nonce, data, aad) {
    if (data.length < MAC_LENGTH) {
        throw new Error("message data not long enough");
    }
    const ctx = new cipher.Decipher("AES-128-GCM");
    ctx.init(key, nonce);
    ctx.setAAD(aad);
    ctx.setAuthTag(data.slice(data.length - MAC_LENGTH));
    return Buffer.concat([
        ctx.update(data.slice(0, data.length - MAC_LENGTH)),
        ctx.final(),
    ]);
}
export function encryptMessage(key, nonce, data, aad) {
    const ctx = new cipher.Cipher("AES-128-GCM");
    ctx.init(key, nonce);
    ctx.setAAD(aad);
    return Buffer.concat([
        ctx.update(data),
        ctx.final(),
        ctx.getAuthTag(), // append mac
    ]);
}
//# sourceMappingURL=crypto.js.map