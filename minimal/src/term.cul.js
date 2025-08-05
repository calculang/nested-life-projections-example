
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

// For minimal I moved `fut_x` formulas to capital-requirements.cul.js


// inputs:
export const t = () => t_in;

export const term_m = () => term_m_in ?? 120;
export const premium = () => premium_in ?? 1300;
export const sum_assured = () => sum_assured_in ?? 100_000;
