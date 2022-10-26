export function toBuffer(arr) {
    return Buffer.from(arr.buffer, arr.byteOffset, arr.length);
}
// multiaddr 8.0.0 expects an Uint8Array with internal buffer starting at 0 offset
export function toNewUint8Array(buf) {
    const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return new Uint8Array(arrayBuffer);
}
export function numberToBuffer(value, length) {
    const res = Buffer.alloc(length);
    res.writeUIntBE(value, 0, length);
    return res;
}
export function bufferToNumber(buffer, length, offset = 0) {
    return buffer.readUIntBE(offset, length);
}
//# sourceMappingURL=toBuffer.js.map