import { RequestId, IPingMessage, IFindNodeMessage, INodesMessage, ITalkReqMessage, ITalkRespMessage } from "./types.js";
import { SequenceNumber, ENR } from "../enr/index.js";
export declare function createRequestId(): RequestId;
export declare function createPingMessage(enrSeq: SequenceNumber): IPingMessage;
export declare function createFindNodeMessage(distances: number[]): IFindNodeMessage;
export declare function createNodesMessage(id: RequestId, total: number, enrs: ENR[]): INodesMessage;
export declare function createTalkRequestMessage(request: string | Uint8Array, protocol: string | Uint8Array): ITalkReqMessage;
export declare function createTalkResponseMessage(requestId: RequestId, payload: Uint8Array): ITalkRespMessage;
//# sourceMappingURL=create.d.ts.map