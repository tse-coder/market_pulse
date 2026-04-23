type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassValue =
  | string
  | false
  | null
  | undefined
  | ClassDictionary
  | ClassValue[];

function flattenClassValue(value: ClassValue): string[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenClassValue);
  }

  return Object.entries(value)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([className]) => className);
}

export function cn(...classes: ClassValue[]) {
  return classes.flatMap(flattenClassValue).join(" ");
}
