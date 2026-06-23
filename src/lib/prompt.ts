export function renderTemplate(tpl: string, ctx: Record<string, any> = {}) {
  if (!tpl) return "";
  return tpl.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const parts = key.split(".");
    let v: any = ctx;
    for (const p of parts) {
      if (v == null) return "";
      v = v[p];
    }
    return v == null ? "" : String(v);
  });
}

export function applyCompanyDefaults(options: Record<string, any>, companyDefaults?: Record<string, any>) {
  if (!companyDefaults) return options;
  const merged = { ...options };
  for (const k of Object.keys(companyDefaults)) {
    if (merged[k] == null) merged[k] = companyDefaults[k];
  }
  return merged;
}
