import { randomBytes } from "bcrypto/lib/random.js";
import { toBigIntBE } from "bigint-buffer";
import { MessageType, } from "./types.js";
export function createRequestId() {
    return toBigIntBE(randomBytes(8));
}
export function createPingMessage(enrSeq) {
    return {
        type: MessageType.PING,
        id: createRequestId(),
        enrSeq,
    };
}
export function createPongMessage(id, enrSeq, recipientIp, recipientPort) {
    return {
        type: MessageType.PONG,
        id,
        enrSeq,
        recipientIp,
        recipientPort,
    };
}
export function createFindNodeMessage(distances) {
    return {
        type: MessageType.FINDNODE,
        id: createRequestId(),
        distances,
    };
}
export function createNodesMessage(id, total, enrs) {
    return {
        type: MessageType.NODES,
        id,
        total,
        enrs,
    };
}
export function createTalkRequestMessage(request, protocol) {
    return {
        type: MessageType.TALKREQ,
        id: createRequestId(),
        protocol: Buffer.from(protocol),
        request: Buffer.from(request),
    };
}
export function createTalkResponseMessage(requestId, payload) {
    return {
        type: MessageType.TALKRESP,
        id: requestId,
        response: Buffer.from(payload),
    };
}
//# sourceMappingURL=create.js.map