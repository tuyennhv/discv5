/// <reference types="node" />
import { IKeypairClass } from "./types.js";
export declare function secp256k1PublicKeyToCompressed(publicKey: Buffer): Buffer;
export declare function secp256k1PublicKeyToFull(publicKey: Buffer): Buffer;
export declare function secp256k1PublicKeyToRaw(publicKey: Buffer): Buffer;
export declare const Secp256k1Keypair: IKeypairClass;
//# sourceMappingURL=secp256k1.d.ts.map