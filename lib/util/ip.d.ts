import { Multiaddr } from "@multiformats/multiaddr";
import { ENR } from "../enr/index.js";
export declare type IP = {
    type: 4 | 6;
    octets: Uint8Array;
};
export declare type SocketAddress = {
    ip: IP;
    port: number;
};
export declare function ipFromBytes(bytes: Uint8Array): IP | undefined;
export declare function ipToBytes(ip: IP): Uint8Array;
export declare function isEqualSocketAddress(s1: SocketAddress, s2: SocketAddress): boolean;
export declare function getSocketAddressOnENR(enr: ENR): SocketAddress | undefined;
export declare function setSocketAddressOnENR(enr: ENR, s: SocketAddress): void;
export declare function multiaddrFromSocketAddress(s: SocketAddress): Multiaddr;
export declare function multiaddrToSocketAddress(multiaddr: Multiaddr): SocketAddress;
//# sourceMappingURL=ip.d.ts.map