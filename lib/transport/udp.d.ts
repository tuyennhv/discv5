import { Multiaddr } from "@multiformats/multiaddr";
import { IPacket } from "../packet/index.js";
import { ITransportService, TransportEventEmitter } from "./types.js";
import { IRateLimiter } from "../rateLimit/index.js";
declare const UDPTransportService_base: new () => TransportEventEmitter;
/**
 * This class is responsible for encoding outgoing Packets and decoding incoming Packets over UDP
 */
export declare class UDPTransportService extends UDPTransportService_base implements ITransportService {
    readonly multiaddr: Multiaddr;
    private readonly srcId;
    private readonly rateLimiter?;
    private socket;
    constructor(multiaddr: Multiaddr, srcId: string, rateLimiter?: IRateLimiter | undefined);
    start(): Promise<void>;
    stop(): Promise<void>;
    send(to: Multiaddr, toId: string, packet: IPacket): Promise<void>;
    addExpectedResponse(ipAddress: string): void;
    removeExpectedResponse(ipAddress: string): void;
    private handleIncoming;
}
export {};
//# sourceMappingURL=udp.d.ts.map