/**
 * Generic Cell Rate Algorithm is a leaky bucket-type scheduling algorithm.
 *
 * Most rate-limit implementations are either time-bucket or leaky-bucket based. The time-bucket requires the storage
 * of two values and does not enforce a rate, while the leaky-bucket approach requires a separate process to
 * continually refill the bucket. GCRA only storing a value (the TAT) while still being simple. GCRA may be rarely
 * used because of its perceived complexity.
 *
 * GCRA aims to limit requests to `R = L/P`, where this implementation sets `L = 1` for simplicity. The target rate
 * then is `R = 1/P` so request separated by at least `P` are not limited. Define the Theoretical Arrival Time (TAT)
 * of the next request to be equal
 */
export class RateLimiterGRCA {
    tau;
    t;
    /** Time when the bucket will be full for each peer. TAT (theoretical arrival time) from GCRA */
    tatPerKey = new Map();
    startTimeMs = Date.now();
    constructor(
    /** After how long is the bucket considered full via replenishing 1T every `t`. */
    tau, 
    /** How often is 1 token replenished */
    t) {
        this.tau = tau;
        this.t = t;
        this.tau = tau;
        this.t = t;
    }
    static fromQuota(quota) {
        if (quota.maxTokens === 0) {
            throw Error("Max number of tokens should be positive");
        }
        const tau = quota.replenishAllEvery;
        if (tau === 0) {
            throw Error("Replenish time must be positive");
        }
        const t = tau / quota.maxTokens;
        return new RateLimiterGRCA(tau, t);
    }
    allows(key, tokens, msSinceStart) {
        if (msSinceStart === undefined) {
            msSinceStart = Date.now() - this.startTimeMs;
        }
        /** how long does it take to replenish these tokens */
        const additionalTime = this.t * tokens;
        if (additionalTime > this.tau) {
            // the time required to process this amount of tokens is longer than the time that makes the bucket full.
            return false;
        }
        // If the key is new, we consider their bucket full (which means, their request will be allowed)
        let tat = this.tatPerKey.get(key);
        if (tat === undefined) {
            tat = msSinceStart;
            this.tatPerKey.set(key, tat);
        }
        // check how soon could the request be made
        const earliestTime = tat + additionalTime - this.tau;
        if (msSinceStart < earliestTime) {
            return false;
        }
        // calculate the new TAT
        this.tatPerKey.set(key, Math.max(msSinceStart, tat) + additionalTime);
        return true;
    }
    /** Removes keys for which their bucket is full by `time_limit` */
    prune(timeLimit) {
        for (const entry of this.tatPerKey.entries()) {
            // remove those for which tat < lim
            if (entry[1] < timeLimit) {
                this.tatPerKey.delete(entry[0]);
            }
        }
    }
}
//# sourceMappingURL=rateLimiterGRCA.js.map