import * as RLP from "rlp";
import { convertToString } from "@multiformats/multiaddr/convert";
import { toBigIntBE } from "bigint-buffer";
import * as ip6addr from "ip6addr";
import { MessageType, } from "./types.js";
import { ENR } from "../enr/index.js";
import { toNewUint8Array } from "../util/index.js";
const ERR_INVALID_MESSAGE = "invalid message";
export function decode(data) {
    const type = data[0];
    switch (type) {
        case MessageType.PING:
            return decodePing(data);
        case MessageType.PONG:
            return decodePong(data);
        case MessageType.FINDNODE:
            return decodeFindNode(data);
        case MessageType.NODES:
            return decodeNodes(data);
        case MessageType.TALKREQ:
            return decodeTalkReq(data);
        case MessageType.TALKRESP:
            return decodeTalkResp(data);
        case MessageType.REGTOPIC:
            return decodeRegTopic(data);
        case MessageType.TICKET:
            return decodeTicket(data);
        case MessageType.REGCONFIRMATION:
            return decodeRegConfirmation(data);
        case MessageType.TOPICQUERY:
            return decodeTopicQuery(data);
        default:
            throw new Error(ERR_INVALID_MESSAGE);
    }
}
function decodePing(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 2) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.PING,
        id: toBigIntBE(rlpRaw[0]),
        enrSeq: toBigIntBE(rlpRaw[1]),
    };
}
function decodePong(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 4) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    let stringIpAddr = convertToString("ip4", toNewUint8Array(rlpRaw[2]));
    // let stringIpAddr = ipBufferToString(rlpRaw[2]);
    const parsedIp = ip6addr.parse(stringIpAddr);
    if (parsedIp.kind() === "ipv4") {
        stringIpAddr = parsedIp.toString({ format: "v4" });
    }
    return {
        type: MessageType.PONG,
        id: toBigIntBE(rlpRaw[0]),
        enrSeq: toBigIntBE(rlpRaw[1]),
        recipientIp: stringIpAddr,
        recipientPort: rlpRaw[3].length ? rlpRaw[3].readUIntBE(0, rlpRaw[3].length) : 0,
    };
}
function decodeFindNode(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 2) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    if (!Array.isArray(rlpRaw[1])) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    const distances = rlpRaw[1].map((x) => (x.length ? x.readUIntBE(0, x.length) : 0));
    return {
        type: MessageType.FINDNODE,
        id: toBigIntBE(rlpRaw[0]),
        distances,
    };
}
function decodeNodes(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 3 || !Array.isArray(rlpRaw[2])) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.NODES,
        id: toBigIntBE(rlpRaw[0]),
        total: rlpRaw[1].length ? rlpRaw[1].readUIntBE(0, rlpRaw[1].length) : 0,
        enrs: rlpRaw[2].map((enrRaw) => ENR.decodeFromValues(enrRaw)),
    };
}
function decodeTalkReq(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 3) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.TALKREQ,
        id: toBigIntBE(rlpRaw[0]),
        protocol: rlpRaw[1],
        request: rlpRaw[2],
    };
}
function decodeTalkResp(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 2) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.TALKRESP,
        id: toBigIntBE(rlpRaw[0]),
        response: rlpRaw[1],
    };
}
function decodeRegTopic(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 4 || !Array.isArray(rlpRaw[2])) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.REGTOPIC,
        id: toBigIntBE(rlpRaw[0]),
        topic: rlpRaw[1],
        enr: ENR.decodeFromValues(rlpRaw[2]),
        ticket: rlpRaw[3],
    };
}
function decodeTicket(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 3) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.TICKET,
        id: toBigIntBE(rlpRaw[0]),
        ticket: rlpRaw[1],
        waitTime: rlpRaw[2].length ? rlpRaw[2].readUIntBE(0, rlpRaw[2].length) : 0,
    };
}
function decodeRegConfirmation(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 2) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.REGCONFIRMATION,
        id: toBigIntBE(rlpRaw[0]),
        topic: rlpRaw[1],
    };
}
function decodeTopicQuery(data) {
    const rlpRaw = RLP.decode(data.slice(1));
    if (!Array.isArray(rlpRaw) || rlpRaw.length !== 2) {
        throw new Error(ERR_INVALID_MESSAGE);
    }
    return {
        type: MessageType.TOPICQUERY,
        id: toBigIntBE(rlpRaw[0]),
        topic: rlpRaw[1],
    };
}
//# sourceMappingURL=decode.js.map