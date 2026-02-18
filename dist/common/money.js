"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAmountToUnits = parseAmountToUnits;
exports.formatUnitsToAmount = formatUnitsToAmount;
exports.assertPositive = assertPositive;
const SCALE = 100n;
function parseAmountToUnits(input) {
    const normalized = typeof input === "number" ? input.toString() : input.trim();
    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
        throw new Error("Amount must be a positive number with up to 2 decimal places");
    }
    const parts = normalized.split(".");
    const whole = parts[0] ?? "0";
    const fraction = parts[1] ?? "";
    const fractionPadded = `${fraction}00`.slice(0, 2);
    return BigInt(whole) * SCALE + BigInt(fractionPadded);
}
function formatUnitsToAmount(units) {
    const whole = units / SCALE;
    const fraction = units % SCALE;
    const fractionStr = fraction.toString().padStart(2, "0");
    return `${whole.toString()}.${fractionStr}`;
}
function assertPositive(units, fieldName = "amount") {
    if (units <= 0n) {
        throw new Error(`${fieldName} must be greater than zero`);
    }
}
//# sourceMappingURL=money.js.map