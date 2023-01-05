import { IDiscv5Metrics } from "../service/index.js";
import { RateLimiterQuota } from "./rateLimiterGRCA.js";
declare type IPAddress = string;
export interface PacketSrc {
    address: IPAddress;
    family: "IPv4" | "IPv6";
    port: number;
    size: number;
}
export interface RateLimiterOpts {
    globalQuota: RateLimiterQuota;
    byIPQuota: RateLimiterQuota;
}
export interface IRateLimiter {
    allowEncodedPacket(ip: IPAddress): boolean;
    addExpectedResponse(ip: IPAddress): void;
    removeExpectedResponse(ip: IPAddress): void;
}
export declare class RateLimiter implements IRateLimiter {
    private readonly metrics;
    private readonly rateLimiterGlobal;
    private readonly rateLimiterIP;
    private readonly bannedIPs;
    private readonly expectedResponsesByIP;
    constructor(opts: RateLimiterOpts, metrics: IDiscv5Metrics | null);
    allowEncodedPacket(ip: IPAddress): boolean;
    addExpectedResponse(ip: IPAddress): void;
    removeExpectedResponse(ip: IPAddress): void;
    /** After a request initiated by us we expected a response from this IP */
    private expectsResponseFromIP;
}
export {};
//# sourceMappingURL=index.d.ts.map