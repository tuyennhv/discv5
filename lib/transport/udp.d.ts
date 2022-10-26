/// <reference types="node" />
import { Multiaddr } from "@multiformats/multiaddr";
import { IPacket } from "../packet/index.js";
import { IRemoteInfo, ITransportService, TransportEventEmitter } from "./types.js";
declare const UDPTransportService_base: new () => TransportEventEmitter;
/**
 * This class is responsible for encoding outgoing Packets and decoding incoming Packets over UDP
 */
export declare class UDPTransportService extends UDPTransportService_base implements ITransportService {
    multiaddr: Multiaddr;
    private socket;
    private srcId;
    constructor(multiaddr: Multiaddr, srcId: string);
    start(): Promise<void>;
    stop(): Promise<void>;
    send(to: Multiaddr, toId: string, packet: IPacket): Promise<void>;
    handleIncoming: (data: Buffer, rinfo: IRemoteInfo) => void;
}
export {};
//# sourceMappingURL=udp.d.ts.map