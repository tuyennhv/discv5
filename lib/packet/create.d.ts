/// <reference types="node" />
import { NodeId, SequenceNumber } from "../enr/index.js";
import { IHeader, IPacket, PacketType } from "./types.js";
export declare function createHeader(flag: PacketType, authdata: Buffer, nonce?: Buffer): IHeader;
export declare function createRandomPacket(srcId: NodeId): IPacket;
export declare function createWhoAreYouPacket(nonce: Buffer, enrSeq: SequenceNumber): IPacket;
//# sourceMappingURL=create.d.ts.map