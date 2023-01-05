import { toHex } from "../util/index.js";
export function createNodeId(buffer) {
    if (buffer.length !== 32) {
        throw new Error("NodeId must be 32 bytes in length");
    }
    return toHex(buffer);
}
//# sourceMappingURL=create.js.map