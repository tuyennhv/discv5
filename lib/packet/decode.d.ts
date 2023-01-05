/// <reference types="node" />
import { IAuthMessagePacket, IMessagePacket, IWhoAreYouPacket, Magic, Packet, Tag, IAuthResponse } from "./types";
/**
 * Decode raw bytes into a packet. The `magic` value (SHA2256(node-id, b"WHOAREYOU")) is passed as a parameter to check
 * for the magic byte sequence.
 *
 * Note: this function will modify the input data
 */
export declare function decode(data: Buffer, magic: Magic): Packet;
export declare function decodeWhoAreYou(magic: Magic, data: Buffer[], remainder: Buffer): IWhoAreYouPacket;
export declare function decodeStandardMessage(tag: Tag, data: Buffer, remainder: Buffer): IMessagePacket;
export declare function decodeAuthHeader(tag: Tag, data: Buffer[], remainder: Buffer): IAuthMessagePacket;
export declare function decodeAuthResponse(data: Buffer): IAuthResponse;
