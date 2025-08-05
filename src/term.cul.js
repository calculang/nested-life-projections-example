// On it's own these formulas reproduce nesting.py Term class cashflows (Premiums and Claims)
// For proof just check some values after deleting all the new formula definitions in capital.cul.js

export const premiums = () => {
  if (t() >= 0 && t() < term_m() - 1) return (num_pols_if() * premium()) / 12;
  else return 0;
};

export const claims = () => {
  if (t() >= 0 && t() < term_m()) return -num_deaths() * sum_assured();
  else return 0;
};

export const num_pols_if = () => {
  if (t() == 0) return 1;
  else return num_pols_if({ t_in: t() - 1 }) - num_deaths({ t_in: t() - 1 });
};

export const num_deaths = () => {
  if (t() == 0) return 0;
  else return num_pols_if({ t_in: t() - 1 }) * q_x({ t_in: t() - 1 });
};

export const q_x = () => 0.001;

export const net_cashflow = () => premiums() + claims(); // note signs

// future sums
// specific (prudent) projections of these are used in calculation of capital.cul.js
// These formulas can be hoisted there

export const fut_net_cashflow = () => {
  if (t() > term_m()) return 0;
  return fut_net_cashflow({ t_in: t() + 1 }) + net_cashflow();
};

export const fut_premiums = () => {
  if (t() >= term_m()) return 0;
  return fut_premiums({ t_in: t() + 1 }) + premiums();
};

export const fut_claims = () => {
  if (t() > term_m() - 1) return 0;
  return fut_claims({ t_in: t() + 1 }) + claims();
};

// Playground UI uses this to determine # months of results to take from model
export const proj_len = () => term_m();

// Playground UI uses specific pv_ formula names for visualization:
export const pv_premiums = () => 1 * premiums();
export const pv_claims = () => 1 * claims();

// some things which effectively aren't used at all in calculang implementation:

export const age = () => start_age() + Math.floor(t() / 12);
export const term_remaining = () => term_m() - t();

// inputs:
export const t = () => t_in;

// setting default values from model point data specified in nested.py __main__ block
export const term_m = () => term_m_in ?? 120;
export const premium = () => premium_in ?? 1300;
export const sum_assured = () => 100_000; // for interactive sum assured in Playground UI use:  sum_assured_in ?? 100_000
export const start_age = () => start_age_in ?? 30; // not used
