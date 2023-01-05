import { symbol as peerDiscoverySymbol } from "@libp2p/interface-peer-discovery";
import { CustomEvent, EventEmitter } from "@libp2p/interfaces/events";
import { multiaddr } from "@multiformats/multiaddr";
import { Discv5 } from "../service/index.js";
// Default to 0ms between automatic searches
// 0ms is 'backwards compatible' with the prior behavior (always be searching)
// Further analysis should be done to determine a good number
const DEFAULT_SEARCH_INTERVAL_MS = 0;
/**
 * Discv5Discovery is a libp2p peer-discovery compatible module
 */
export class Discv5Discovery extends EventEmitter {
    [Symbol.toStringTag] = "discv5";
    [peerDiscoverySymbol] = true;
    discv5;
    searchInterval;
    started;
    controller;
    constructor(options) {
        super();
        this.discv5 = Discv5.create({
            enr: options.enr,
            peerId: options.peerId,
            multiaddr: multiaddr(options.bindAddr),
            config: options,
            metrics: options.metrics,
        });
        this.searchInterval = options.searchInterval ?? DEFAULT_SEARCH_INTERVAL_MS;
        this.started = false;
        this.controller = new AbortController();
        options.bootEnrs.forEach((bootEnr) => this.discv5.addEnr(bootEnr));
    }
    async start() {
        if (this.started) {
            return;
        }
        this.started = true;
        this.controller = new AbortController();
        await this.discv5.start();
        this.discv5.on("discovered", this.handleEnr);
        setTimeout(() => this.findPeers(), 1);
    }
    async stop() {
        if (!this.started) {
            return;
        }
        this.started = false;
        this.discv5.off("discovered", this.handleEnr);
        await this.discv5.stop();
        this.controller.abort();
    }
    async findPeers() {
        if (this.searchInterval === Infinity)
            return;
        while (this.started) {
            // Search for random nodes
            // emit discovered on all finds
            const enrs = await this.discv5.findRandomNode();
            if (!this.started) {
                return;
            }
            for (const enr of enrs) {
                await this.handleEnr(enr);
            }
            try {
                if (this.searchInterval === Infinity)
                    return;
                await sleep(this.searchInterval, this.controller.signal);
            }
            catch (e) {
                return;
            }
        }
    }
    handleEnr = async (enr) => {
        const multiaddrTCP = enr.getLocationMultiaddr("tcp");
        if (!multiaddrTCP) {
            return;
        }
        this.dispatchEvent(new CustomEvent("peer", {
            detail: {
                id: await enr.peerId(),
                multiaddrs: [
                    // TODO fix whatever type issue is happening here :(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    multiaddrTCP,
                ],
                protocols: [],
            },
        }));
    };
}
/**
 * Abortable sleep function. Cleans everything on all cases preventing leaks
 * On abort throws Error
 */
async function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
        if (signal.aborted)
            return reject(new Error());
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let onDone = () => { };
        const timeout = setTimeout(() => {
            onDone();
            resolve();
        }, ms);
        const onAbort = () => {
            onDone();
            reject(new Error());
        };
        signal.addEventListener("abort", onAbort);
        onDone = () => {
            clearTimeout(timeout);
            signal.removeEventListener("abort", onAbort);
        };
    });
}
//# sourceMappingURL=discv5.js.map