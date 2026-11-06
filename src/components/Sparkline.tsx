interface SparklineProps {
  values: number[];
  stroke?: string;
}

export function Sparkline({ values, stroke = '#34d399' }: SparklineProps) {
  if (values.length < 2) return <div className="h-12" aria-hidden="true" />;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 40 - (Math.min(100, Math.max(0, value)) / 100) * 40;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        points={points}
      />
    </svg>
  );
}
