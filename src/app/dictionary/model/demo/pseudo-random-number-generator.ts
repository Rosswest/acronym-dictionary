/**
 * Standard Linear congruential Generator with replicable results based on seed (i.e. x(0))
 * x(n+1) = [a*x(n) + c] % m
 * where:
 *      x(0) = seed / start value
 *      x(n+1) = next value
 *      a = multiplier
 *      c = increment
 *      m = modulus
 */
export class PseudoRandomNumberGenerator {
    currentValue: number;
    modulus: number;
    multiplier: number;
    increment: number;

    constructor(seed: number) {
        this.initialise(seed);
    }


    private initialise(seed: number): void {
        this.currentValue = seed;
        this.modulus = 0x80000000; // 2**31;
        this.multiplier = 1103515245;
        this.increment = 12345;
    }

    /**
     * Returns a random value between 0 and 1
     */
    public getRandom() {
        this.advanceState();
        const truncated = (this.currentValue / this.modulus);
        return truncated;
    }

    /**
     * Generates and returns a pseudo-random number between the two specified values
     * @param min The minimum resulting value
     * @param max The maximum resulting value
     * @returns A pseudo-random value between min and max
     */
    public getRandomInRange(min: number, max: number) {
        const r = this.getRandom();
        const range = max - min;
        const result = min + (r * range);
        return result;
    }

    /**
     * Generates the next value in the sequence and sets the current value to that value
     */
    private advanceState() {
        const withoutModulus = (this.multiplier * this.currentValue) + this.increment;
        const withModulus = (withoutModulus % this.modulus);
        this.currentValue = withModulus;
    }

}
