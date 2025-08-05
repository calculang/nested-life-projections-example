import { fut_claims } from "capital-requirements.cul.js";import { fut_premiums } from "capital-requirements.cul.js";import { capital_change } from "capital-requirements.cul.js";import { capital_requirement } from "capital-requirements.cul.js";import { prudence_factor } from "capital-requirements.cul.js";import { t_inner } from "capital-requirements.cul.js";import { q_x } from "capital-requirements.cul.js";export const premiums = ({ t_in, term_m_in, t_inner_in, prudence_factor_in, premium_in }) => {
  if (t({ t_in }) >= 0 && t({ t_in }) < term_m({ term_m_in }) - 1) return num_pols_if({ t_in, t_inner_in, prudence_factor_in }) * premium({ premium_in }) / 12;else
  return 0;
};

export const claims = ({ t_in, term_m_in, t_inner_in, prudence_factor_in }) => {
  if (t({ t_in }) >= 0 && t({ t_in }) < term_m({ term_m_in })) return -num_deaths({ t_in, t_inner_in, prudence_factor_in }) * sum_assured({});else
  return 0;
};

export const num_pols_if = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (t({ t_in }) == 0) return 1;else
  return num_pols_if({ t_inner_in, prudence_factor_in, t_in: t({ t_in }) - 1 }) - num_deaths({ t_inner_in, prudence_factor_in, t_in: t({ t_in }) - 1 });
};

export const num_deaths = ({ t_in, t_inner_in, prudence_factor_in }) => {
  if (t({ t_in }) == 0) return 0;else
  return num_pols_if({ t_inner_in, prudence_factor_in, t_in: t({ t_in }) - 1 }) * q_x({ t_inner_in, prudence_factor_in, t_in: t({ t_in }) - 1 });
};

export const q_x_ = ({}) => 0.001;

// For minimal I moved `fut_x` formulas over to capital-requirements.cul.js

// inputs:
export const t = ({ t_in }) => t_in;

export const term_m = ({ term_m_in }) => term_m_in ?? 120;
export const premium = ({ premium_in }) => premium_in ?? 1300;
export const sum_assured = ({}) => 100_000;