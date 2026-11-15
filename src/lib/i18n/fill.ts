/** "Hello {name}" + { name: "Rina" } -> "Hello Rina" */
export function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
