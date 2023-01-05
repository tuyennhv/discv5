import { NodeId } from "../enr/index.js";
import { SocketAddress } from "../util/ip.js";
export declare class AddrVotes {
    private readonly addrVotesToUpdateEnr;
    /** Bounded by `MAX_VOTES`, on new votes evicts the oldest votes */
    private readonly votes;
    /** Bounded by votes, if the vote count reaches 0, its key is deleted */
    private readonly tallies;
    constructor(addrVotesToUpdateEnr: number);
    /**
     * Adds vote to a given IP:port tuple from a Pong message. If the votes for this addr are greater than `votesToWin`,
     * @returns true if the added vote is the winning vote. In that case clears all existing votes.
     */
    addVote(voter: NodeId, ip: SocketAddress): boolean;
    clear(): void;
}
//# sourceMappingURL=addrVotes.d.ts.map