/// <reference types="node" />
import { Multiaddr } from "@multiformats/multiaddr";
import { PeerId } from "@libp2p/interface-peer-id";
import { ENRKey, ENRValue, SequenceNumber, NodeId } from "./types.js";
import { KeypairType, IKeypair } from "../keypair/index.js";
export declare class ENR extends Map<ENRKey, ENRValue> {
    seq: SequenceNumber;
    signature: Buffer | null;
    private _nodeId?;
    constructor(kvs?: Record<ENRKey, ENRValue>, seq?: SequenceNumber, signature?: Buffer | null);
    static createV4(publicKey: Buffer, kvs?: Record<ENRKey, ENRValue>): ENR;
    static createFromPeerId(peerId: PeerId, kvs?: Record<ENRKey, ENRValue>): ENR;
    static decodeFromValues(decoded: Buffer[]): ENR;
    static decode(encoded: Buffer): ENR;
    static decodeTxt(encoded: string): ENR;
    set(k: ENRKey, v: ENRValue): this;
    get id(): string;
    get keypairType(): KeypairType;
    get publicKey(): Buffer;
    get keypair(): IKeypair;
    peerId(): Promise<PeerId>;
    get nodeId(): NodeId;
    get ip(): string | undefined;
    set ip(ip: string | undefined);
    get tcp(): number | undefined;
    set tcp(port: number | undefined);
    get udp(): number | undefined;
    set udp(port: number | undefined);
    get ip6(): string | undefined;
    set ip6(ip: string | undefined);
    get tcp6(): number | undefined;
    set tcp6(port: number | undefined);
    get udp6(): number | undefined;
    set udp6(port: number | undefined);
    getLocationMultiaddr(protocol: "udp" | "udp4" | "udp6" | "tcp" | "tcp4" | "tcp6"): Multiaddr | undefined;
    setLocationMultiaddr(multiaddr: Multiaddr): void;
    getFullMultiaddr(protocol: "udp" | "udp4" | "udp6" | "tcp" | "tcp4" | "tcp6"): Promise<Multiaddr | undefined>;
    verify(data: Buffer, signature: Buffer): boolean;
    sign(data: Buffer, privateKey: Buffer): Buffer;
    encodeToValues(privateKey?: Buffer): (ENRKey | ENRValue | number)[];
    encode(privateKey?: Buffer): Buffer;
    encodeTxt(privateKey?: Buffer): string;
}
//# sourceMappingURL=enr.d.ts.map