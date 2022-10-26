/// <reference types="node" />
import { PeerId } from "@libp2p/interface-peer-id";
import { IKeypair, KeypairType } from "./types.js";
export * from "./types.js";
export * from "./secp256k1.js";
export declare function generateKeypair(type: KeypairType): IKeypair;
export declare function createKeypair(type: KeypairType, privateKey?: Buffer, publicKey?: Buffer): IKeypair;
export declare function createPeerIdFromKeypair(keypair: IKeypair): Promise<PeerId>;
export declare function createKeypairFromPeerId(peerId: PeerId): IKeypair;
//# sourceMappingURL=index.d.ts.map