import { randomBytes } from "bcrypto/lib/random.js";
import { ID_NONCE_SIZE, MASKING_IV_SIZE, NONCE_SIZE } from "./constants.js";
import { encodeMessageAuthdata, encodeWhoAreYouAuthdata } from "./encode.js";
import { PacketType } from "./types.js";
export function createHeader(flag, authdata, nonce = randomBytes(NONCE_SIZE)) {
    return {
        protocolId: "discv5",
        version: 1,
        flag,
        nonce,
        authdataSize: authdata.length,
        authdata,
    };
}
export function createRandomPacket(srcId) {
    const authdata = encodeMessageAuthdata({ srcId });
    const header = createHeader(PacketType.Message, authdata);
    const maskingIv = randomBytes(MASKING_IV_SIZE);
    const message = randomBytes(44);
    return {
        maskingIv,
        header,
        message,
    };
}
export function createWhoAreYouPacket(nonce, enrSeq) {
    const idNonce = randomBytes(ID_NONCE_SIZE);
    const authdata = encodeWhoAreYouAuthdata({ idNonce, enrSeq });
    const header = createHeader(PacketType.WhoAreYou, authdata, nonce);
    const maskingIv = randomBytes(MASKING_IV_SIZE);
    const message = Buffer.alloc(0);
    return {
        maskingIv,
        header,
        message,
    };
}
//# sourceMappingURL=create.js.map