import * as dgram from "dgram";
import { EventEmitter } from "events";
import { multiaddr } from "@multiformats/multiaddr";
import { decodePacket, encodePacket, MAX_PACKET_SIZE } from "../packet/index.js";
/**
 * This class is responsible for encoding outgoing Packets and decoding incoming Packets over UDP
 */
export class UDPTransportService extends EventEmitter {
    multiaddr;
    srcId;
    rateLimiter;
    socket;
    constructor(multiaddr, srcId, rateLimiter) {
        super();
        this.multiaddr = multiaddr;
        this.srcId = srcId;
        this.rateLimiter = rateLimiter;
        const opts = multiaddr.toOptions();
        if (opts.transport !== "udp") {
            throw new Error("Local multiaddr must use UDP");
        }
    }
    async start() {
        const opts = this.multiaddr.toOptions();
        this.socket = dgram.createSocket({
            recvBufferSize: 16 * MAX_PACKET_SIZE,
            sendBufferSize: MAX_PACKET_SIZE,
            type: opts.family === 4 ? "udp4" : "udp6",
        });
        this.socket.on("message", this.handleIncoming);
        return new Promise((resolve) => this.socket.bind(opts.port, opts.host, resolve));
    }
    async stop() {
        this.socket.off("message", this.handleIncoming);
        return new Promise((resolve) => this.socket.close(resolve));
    }
    async send(to, toId, packet) {
        const nodeAddr = to.toOptions();
        return new Promise((resolve, reject) => this.socket.send(encodePacket(toId, packet), nodeAddr.port, nodeAddr.host, (e) => {
            if (e) {
                reject(e);
            }
            else {
                resolve();
            }
        }));
    }
    addExpectedResponse(ipAddress) {
        this.rateLimiter?.addExpectedResponse(ipAddress);
    }
    removeExpectedResponse(ipAddress) {
        this.rateLimiter?.removeExpectedResponse(ipAddress);
    }
    handleIncoming = (data, rinfo) => {
        if (this.rateLimiter && !this.rateLimiter.allowEncodedPacket(rinfo.address)) {
            return;
        }
        const mu = multiaddr(`/${String(rinfo.family).endsWith("4") ? "ip4" : "ip6"}/${rinfo.address}/udp/${rinfo.port}`);
        let packet;
        try {
            packet = decodePacket(this.srcId, data);
        }
        catch (e) {
            this.emit("decodeError", e, mu);
            return;
        }
        this.emit("packet", mu, packet);
    };
}
//# sourceMappingURL=udp.js.map