"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const RLP = __importStar(require("rlp"));
const enr_1 = require("../enr");
const types_1 = require("./types");
const constants_1 = require("./constants");
/**
 * Decode raw bytes into a packet. The `magic` value (SHA2256(node-id, b"WHOAREYOU")) is passed as a parameter to check
 * for the magic byte sequence.
 *
 * Note: this function will modify the input data
 */
function decode(data, magic) {
    if (data.length > constants_1.MAX_PACKET_SIZE) {
        throw new Error(constants_1.ERR_TOO_LARGE);
    }
    // ensure the packet is large enough to contain the correct headers
    if (data.length < constants_1.TAG_LENGTH + constants_1.AUTH_TAG_LENGTH + 1) {
        throw new Error(constants_1.ERR_TOO_SMALL);
    }
    const tag = data.slice(0, constants_1.TAG_LENGTH);
    data = data.slice(constants_1.TAG_LENGTH);
    const decoded = RLP.decode(data, true);
    // data looks like either:
    //   magic ++ rlp_list(...)
    //   tag   ++ rlp_bytes(...) ++ message
    //   tag   ++ rlp_list(...)  ++ message
    if (tag.equals(magic)) {
        return decodeWhoAreYou(tag, decoded.data, decoded.remainder);
    }
    else if (!Array.isArray(decoded.data)) {
        return decodeStandardMessage(tag, decoded.data, decoded.remainder);
    }
    else {
        return decodeAuthHeader(tag, decoded.data, decoded.remainder);
    }
}
exports.decode = decode;
function decodeWhoAreYou(magic, data, remainder) {
    if (!Array.isArray(data) || data.length !== 3 || remainder.length > 0) {
        throw new Error(constants_1.ERR_UNKNOWN_FORMAT);
    }
    const [token, idNonce, enrSeqBytes] = data;
    if (idNonce.length !== constants_1.ID_NONCE_LENGTH || token.length !== constants_1.AUTH_TAG_LENGTH) {
        throw new Error(constants_1.ERR_INVALID_BYTE_SIZE);
    }
    const enrSeq = enrSeqBytes.length ? Number(`0x${enrSeqBytes.toString("hex")}`) : 0;
    return {
        type: types_1.PacketType.WhoAreYou,
        token,
        magic,
        idNonce,
        enrSeq,
    };
}
exports.decodeWhoAreYou = decodeWhoAreYou;
function decodeStandardMessage(tag, data, remainder) {
    return {
        type: types_1.PacketType.Message,
        tag,
        authTag: data,
        message: remainder,
    };
}
exports.decodeStandardMessage = decodeStandardMessage;
// Decode a message that contains an authentication header
function decodeAuthHeader(tag, data, remainder) {
    if (!Array.isArray(data) || data.length !== 5) {
        throw new Error(constants_1.ERR_UNKNOWN_FORMAT);
    }
    const [authTag, idNonce, authSchemeNameBytes, ephemeralPubkey, authResponse] = data;
    return {
        type: types_1.PacketType.AuthMessage,
        tag,
        authHeader: {
            authTag,
            idNonce,
            authSchemeName: authSchemeNameBytes.toString("utf8"),
            ephemeralPubkey,
            authResponse,
        },
        message: remainder,
    };
}
exports.decodeAuthHeader = decodeAuthHeader;
function decodeAuthResponse(data) {
    const responseRaw = RLP.decode(data);
    if (!Array.isArray(responseRaw) || responseRaw.length !== 3 || !Array.isArray(responseRaw[2])) {
        throw new Error(constants_1.ERR_UNKNOWN_FORMAT);
    }
    const response = {
        version: responseRaw[0].readInt8(0),
        signature: responseRaw[1],
    };
    response.nodeRecord = responseRaw[2].length ? enr_1.ENR.decodeFromValues(responseRaw[2]) : undefined;
    return response;
}
exports.decodeAuthResponse = decodeAuthResponse;
