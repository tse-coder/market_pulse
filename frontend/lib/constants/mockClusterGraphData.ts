export type ClusterHistoryPoint = {
  val: number;
  label: string;
};

const WEEK_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

const DEFAULT_SERIES: ClusterHistoryPoint[] = [
  { val: 26, label: "W1" },
  { val: 34, label: "W2" },
  { val: 0, label: "W3" },
  { val: 38, label: "W4" },
  { val: 27, label: "W5" },
  { val: 56, label: "W6" },
  { val: 61, label: "W7" },
  { val: 48, label: "W8" },
];

export function getMockClusterHistory(clusterId: string): ClusterHistoryPoint[] {
  if (!clusterId) return DEFAULT_SERIES;

  const seed = Array.from(clusterId).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );

  let momentum = 22 + (seed % 16);

  return WEEK_LABELS.map((label, index) => {
    const drift = ((seed >> (index % 6)) & 7) - 2;
    const growthBias = index > 3 ? 3 : 1;
    momentum = Math.max(12, Math.min(96, momentum + drift + growthBias));

    return { val: momentum, label };
  });
}
