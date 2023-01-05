import * as RLP from "rlp";
import { ipToBytes } from "../util/ip.js";
import { MessageType, } from "./types.js";
export function encode(message) {
    switch (message.type) {
        case MessageType.PING:
            return encodePingMessage(message);
        case MessageType.PONG:
            return encodePongMessage(message);
        case MessageType.FINDNODE:
            return encodeFindNodeMessage(message);
        case MessageType.NODES:
            return encodeNodesMessage(message);
        case MessageType.TALKREQ:
            return encodeTalkReqMessage(message);
        case MessageType.TALKRESP:
            return encodeTalkRespMessage(message);
        case MessageType.REGTOPIC:
            return encodeRegTopicMessage(message);
        case MessageType.TICKET:
            return encodeTicketMessage(message);
        case MessageType.REGCONFIRMATION:
            return encodeRegConfirmMessage(message);
        case MessageType.TOPICQUERY:
            return encodeTopicQueryMessage(message);
    }
}
// TODO remove when rlp supports bigint encoding directly
function toBuffer(n) {
    let hex = n.toString(16);
    if (hex.length % 2 === 1) {
        hex = "0" + hex;
    }
    return Buffer.from(hex, "hex");
}
export function encodePingMessage(m) {
    return Buffer.concat([Buffer.from([MessageType.PING]), RLP.encode([toBuffer(m.id), toBuffer(m.enrSeq)])]);
}
export function encodePongMessage(m) {
    if (m.addr.port < 0 || m.addr.port > 65535) {
        throw new Error("invalid port for encoding");
    }
    return Buffer.concat([
        Buffer.from([MessageType.PONG]),
        RLP.encode([
            //
            toBuffer(m.id),
            toBuffer(m.enrSeq),
            ipToBytes(m.addr.ip),
            m.addr.port,
        ]),
    ]);
}
export function encodeFindNodeMessage(m) {
    return Buffer.concat([Buffer.from([MessageType.FINDNODE]), RLP.encode([toBuffer(m.id), m.distances])]);
}
export function encodeNodesMessage(m) {
    return Buffer.concat([
        Buffer.from([MessageType.NODES]),
        RLP.encode([toBuffer(m.id), m.total, m.enrs.map((enr) => enr.encodeToValues())]),
    ]);
}
export function encodeTalkReqMessage(m) {
    return Buffer.concat([Buffer.from([MessageType.TALKREQ]), RLP.encode([toBuffer(m.id), m.protocol, m.request])]);
}
export function encodeTalkRespMessage(m) {
    return Buffer.concat([Buffer.from([MessageType.TALKRESP]), RLP.encode([toBuffer(m.id), m.response])]);
}
export function encodeRegTopicMessage(m) {
    return Buffer.concat([
        Buffer.from([MessageType.REGTOPIC]),
        RLP.encode([toBuffer(m.id), m.topic, m.enr.encodeToValues(), m.ticket]),
    ]);
}
export function encodeTicketMessage(m) {
    return Buffer.concat([Buffer.from([MessageType.TICKET]), RLP.encode([toBuffer(m.id), m.ticket, m.waitTime])]);
}
export function encodeRegConfirmMessage(m) {
    return Buffer.concat([Buffer.from([MessageType.REGCONFIRMATION]), RLP.encode([toBuffer(m.id), m.topic])]);
}
export function encodeTopicQueryMessage(m) {
    return Buffer.concat([Buffer.from([MessageType.TOPICQUERY]), RLP.encode([toBuffer(m.id), m.topic])]);
}
//# sourceMappingURL=encode.js.map