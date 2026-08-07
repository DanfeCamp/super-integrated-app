/**
 * Amortisation maths for the loan calculator.
 *
 * The schedule is simulated month by month rather than derived from closed-form
 * formulas, because extra payments change the balance path and the closed-form
 * total-interest figure stops being correct the moment one is applied.
 */

export interface LoanInput {
  /** Amount borrowed, in major currency units. */
  principal: number;
  /** Nominal annual rate as a percentage, e.g. `6.5`. */
  annualRate: number;
  /** Total term in months. */
  months: number;
  /** Optional additional amount paid against the principal each month. */
  extraMonthly?: number;
}

export interface ScheduleRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface YearSummary {
  year: number;
  interest: number;
  principal: number;
  endingBalance: number;
  rows: ScheduleRow[];
}

export interface LoanResult {
  /** The scheduled payment, before any extra contribution. */
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  /** Months actually taken — shorter than the term when paying extra. */
  actualMonths: number;
  schedule: ScheduleRow[];
  years: YearSummary[];
  /** Interest saved versus the same loan with no extra payments. */
  interestSaved: number;
  monthsSaved: number;
}

/** Standard annuity payment. Falls back to straight-line for a 0% loan. */
export function monthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (months <= 0) return 0;
  const rate = annualRate / 100 / 12;
  if (rate === 0) return principal / months;
  const growth = (1 + rate) ** months;
  return (principal * rate * growth) / (growth - 1);
}

function simulate(
  principal: number,
  annualRate: number,
  months: number,
  payment: number,
  extra: number
) {
  const rate = annualRate / 100 / 12;
  const schedule: ScheduleRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  // Hard stop at 100 years: a payment too small to cover the interest would
  // otherwise loop forever. Callers validate for this case before calling.
  const limit = Math.min(months, 1200);

  for (let month = 1; month <= limit && balance > 0.005; month += 1) {
    const interest = balance * rate;
    let principalPart = payment + extra - interest;

    // Final instalment: never overpay past the outstanding balance.
    if (principalPart > balance) principalPart = balance;

    const actualPayment = principalPart + interest;
    balance -= principalPart;
    totalInterest += interest;

    schedule.push({
      month,
      payment: actualPayment,
      interest,
      principal: principalPart,
      balance: Math.max(0, balance),
    });
  }

  return { schedule, totalInterest };
}

export function amortize({
  principal,
  annualRate,
  months,
  extraMonthly = 0,
}: LoanInput): LoanResult {
  const payment = monthlyPayment(principal, annualRate, months);
  const extra = Math.max(0, extraMonthly);

  const withExtra = simulate(principal, annualRate, months, payment, extra);
  const baseline =
    extra > 0 ? simulate(principal, annualRate, months, payment, 0) : withExtra;

  const years: YearSummary[] = [];
  withExtra.schedule.forEach((row) => {
    const yearIndex = Math.floor((row.month - 1) / 12);
    let summary = years[yearIndex];
    if (!summary) {
      summary = {
        year: yearIndex + 1,
        interest: 0,
        principal: 0,
        endingBalance: 0,
        rows: [],
      };
      years[yearIndex] = summary;
    }
    summary.interest += row.interest;
    summary.principal += row.principal;
    summary.endingBalance = row.balance;
    summary.rows.push(row);
  });

  const totalPaid = principal + withExtra.totalInterest;

  return {
    monthlyPayment: payment,
    totalInterest: withExtra.totalInterest,
    totalPaid,
    actualMonths: withExtra.schedule.length,
    schedule: withExtra.schedule,
    years,
    interestSaved: Math.max(
      0,
      baseline.totalInterest - withExtra.totalInterest
    ),
    monthsSaved: Math.max(
      0,
      baseline.schedule.length - withExtra.schedule.length
    ),
  };
}

export function formatTerm(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? "month" : "months"}`);
  return parts.join(" ") || "0 months";
}
