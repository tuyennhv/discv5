declare type MiliSeconds = number;
export interface RateLimiterQuota {
    /** How often are `max_tokens` fully replenished. */
    replenishAllEvery: MiliSeconds;
    /** Token limit. This translates on how large can an instantaneous batch of tokens be. */
    maxTokens: number;
}
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
export declare class RateLimiterGRCA<Key> {
    /** After how long is the bucket considered full via replenishing 1T every `t`. */
    private readonly tau;
    /** How often is 1 token replenished */
    private readonly t;
    /** Time when the bucket will be full for each peer. TAT (theoretical arrival time) from GCRA */
    private readonly tatPerKey;
    private readonly startTimeMs;
    constructor(
    /** After how long is the bucket considered full via replenishing 1T every `t`. */
    tau: MiliSeconds, 
    /** How often is 1 token replenished */
    t: MiliSeconds);
    static fromQuota<Key>(quota: RateLimiterQuota): RateLimiterGRCA<Key>;
    allows(key: Key, tokens: number, msSinceStart?: number): boolean;
    /** Removes keys for which their bucket is full by `time_limit` */
    prune(timeLimit: MiliSeconds): void;
}
export {};
//# sourceMappingURL=rateLimiterGRCA.d.ts.map