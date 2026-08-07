import { cn } from "@/lib/utils";

/**
 * SVG analogue face. Hands are positioned with transforms only, so a re-render
 * costs one attribute update rather than a layout pass.
 */
export function AnalogClock({
  hours,
  minutes,
  seconds,
  className,
}: {
  hours: number;
  minutes: number;
  seconds: number;
  className?: string;
}) {
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-full", className)}
      role="img"
      aria-label={`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`}
    >
      <circle
        cx="50"
        cy="50"
        r="47"
        className="fill-muted/40 stroke-border"
        strokeWidth="1.5"
      />

      {/* Ticks: long at the hours, short between. */}
      {Array.from({ length: 60 }, (_, index) => {
        const isHour = index % 5 === 0;
        return (
          <line
            key={index}
            x1="50"
            y1={isHour ? 8 : 9.5}
            x2="50"
            y2={isHour ? 14 : 11.5}
            strokeWidth={isHour ? 1.6 : 0.7}
            strokeLinecap="round"
            className={isHour ? "stroke-foreground/70" : "stroke-border"}
            transform={`rotate(${index * 6} 50 50)`}
          />
        );
      })}

      {[12, 3, 6, 9].map((numeral, index) => {
        const angle = ((index * 90 - 90) * Math.PI) / 180;
        return (
          <text
            key={numeral}
            x={50 + Math.cos(angle) * 33}
            y={50 + Math.sin(angle) * 33}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground text-[8px] font-medium"
          >
            {numeral}
          </text>
        );
      })}

      <g transform={`rotate(${hourAngle} 50 50)`}>
        <line
          x1="50"
          y1="54"
          x2="50"
          y2="28"
          strokeWidth="3.6"
          strokeLinecap="round"
          className="stroke-foreground"
        />
      </g>
      <g transform={`rotate(${minuteAngle} 50 50)`}>
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="18"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="stroke-foreground"
        />
      </g>
      <g transform={`rotate(${secondAngle} 50 50)`}>
        <line
          x1="50"
          y1="58"
          x2="50"
          y2="15"
          strokeWidth="1"
          strokeLinecap="round"
          className="stroke-primary"
        />
      </g>

      <circle cx="50" cy="50" r="2.4" className="fill-primary" />
      <circle cx="50" cy="50" r="1" className="fill-background" />
    </svg>
  );
}
