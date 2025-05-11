import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export function blr(src: string): string {
  return `/_next/image?url=${encodeURIComponent(src)}&q=1&w=5`;
}

export type Pattern = string;
export function isSimpleWildCardMatch(s: string, p: Pattern): boolean {
  const table: any[][] = new Array(s.length + 1)
    .fill(null)
    .map(() => new Array(p.length + 1).fill(false));

  table[0][0] = true;

  for (let i = 1; i <= p.length; i++) {
    if (p[i - 1] === "*") {
      table[0][i] = true;
    }
  }

  for (let i = 1; i <= p.length; i++) {
    for (let j = 1; j <= s.length; j++) {
      const lastMatch = table[j - 1][i - 1];
      if (p[i - 1] === "*") {
        table[j][i] = true;
        continue;
      }
      if (p[i - 1] === s[j - 1] && lastMatch) {
        table[j][i] = true;
      }
    }
  }
  return table[s.length][p.length];
}
