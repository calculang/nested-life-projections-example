import { all_cul } from "./term.cul.js";

export const q_x = () => {
  if (t() >= t_inner()) return q_x_() * prudence_factor();
  else return 0;
};

export const t_inner = () => t_inner_in ?? -1;
export const prudence_factor = () => prudence_factor_in ?? 1;

export const capital_requirement = () =>
  (fut_claims({ t_in: t() + 1, t_inner_in: t(), prudence_factor_in: 1.2 }) +
    fut_premiums({ t_in: t(), t_inner_in: t(), prudence_factor_in: 1.2 })) *
  num_pols_if();

export const capital_change = () => {
  if (t() == 0) return capital_requirement();
  else return capital_requirement() - capital_requirement({ t_in: t() - 1 });
};

export const fut_premiums = () => {
  if (t() >= term_m()) return 0;
  return fut_premiums({ t_in: t() + 1 }) + premiums();
};

export const fut_claims = () => {
  if (t() >= term_m()) return 0;
  return fut_claims({ t_in: t() + 1 }) + claims();
};
