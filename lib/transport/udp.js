import * as dgram from "dgram";
import { EventEmitter } from "events";
import { multiaddr } from "@multiformats/multiaddr";
import { decodePacket, encodePacket, MAX_PACKET_SIZE } from "../packet/index.js";
/**
 * This class is responsible for encoding outgoing Packets and decoding incoming Packets over UDP
 */
export class UDPTransportService extends EventEmitter {
    multiaddr;
    socket;
    srcId;
    constructor(multiaddr, srcId) {
        super();
        const opts = multiaddr.toOptions();
        if (opts.transport !== "udp") {
            throw new Error("Local multiaddr must use UDP");
        }
        this.multiaddr = multiaddr;
        this.srcId = srcId;
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
        return new Promise((resolve) => this.socket.send(encodePacket(toId, packet), nodeAddr.port, nodeAddr.host, () => resolve()));
    }
    handleIncoming = (data, rinfo) => {
        const mu = multiaddr(`/${String(rinfo.family).endsWith("4") ? "ip4" : "ip6"}/${rinfo.address}/udp/${rinfo.port}`);
        try {
            const packet = decodePacket(this.srcId, data);
            this.emit("packet", mu, packet);
        }
        catch (e) {
            this.emit("decodeError", e, mu);
        }
    };
}
//# sourceMappingURL=udp.js.map