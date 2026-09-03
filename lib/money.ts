/** All money in this codebase is integer pennies. */
export type Pennies = number;

/** Parse user input like "30,000", "£4,200.50", " 1200 " into pennies. Null if not a number. */
export function toPennies(input: string): Pennies | null {
  const cleaned = input.replace(/[£,\s]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
  if (!/^-?\d*(\.\d{0,2})?$/.test(cleaned)) return null;
  const negative = cleaned.startsWith("-");
  const [wholeRaw, fracRaw = ""] = cleaned.replace("-", "").split(".");
  const whole = wholeRaw === "" ? 0 : parseInt(wholeRaw, 10);
  const frac = fracRaw === "" ? 0 : parseInt(fracRaw.padEnd(2, "0"), 10);
  const pennies = whole * 100 + frac;
  return negative ? -pennies : pennies;
}

/** Format pennies as GBP: whole pounds shown without decimals, otherwise 2dp. */
export function gbp(p: Pennies): string {
  const abs = Math.abs(p);
  const pounds = Math.floor(abs / 100);
  const pence = abs % 100;
  const grouped = pounds.toLocaleString("en-GB");
  const body = pence === 0 ? `£${grouped}` : `£${grouped}.${String(pence).padStart(2, "0")}`;
  return p < 0 ? `−${body}` : body;
}

/** Pennies to a plain pounds string for editing in an input ("4200" or "4200.50"). */
export function toEditString(p: Pennies): string {
  if (p === 0) return "";
  const abs = Math.abs(p);
  const pounds = Math.floor(abs / 100);
  const pence = abs % 100;
  const body = pence === 0 ? `${pounds}` : `${pounds}.${String(pence).padStart(2, "0")}`;
  return p < 0 ? `-${body}` : body;
}

/** Format a months figure to 1 decimal place. */
export function months1dp(m: number): string {
  return (Math.round(m * 10) / 10).toFixed(1);
}
