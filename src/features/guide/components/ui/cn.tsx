// Utility para concatenar clases (similar a clsx).
// Acepta strings, numbers, arrays y objetos { className: boolean }.
export function cn(...inputs: any[]): string {
  const out: string[] = [];

  const add = (value: any) => {
    if (value === null || value === undefined || value === false) return;

    if (typeof value === "string" || typeof value === "number") {
      out.push(String(value));
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(add);
      return;
    }

    if (typeof value === "object") {
      for (const [key, val] of Object.entries(value)) {
        if (val) out.push(key);
      }
      return;
    }
  };

  inputs.forEach(add);

  return out.join(" ").replace(/\s+/g, " ").trim();
}