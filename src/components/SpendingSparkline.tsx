import React, { useState } from 'react';
import { TrendingUp, Calendar, CreditCard, ChevronRight } from 'lucide-react';

interface SpendingPoint {
  day: number;
  dateStr: string;
  amount: number;
  label: string;
}

interface SpendingSparklineProps {
  totalSpentRub: number;
}

export const SpendingSparkline: React.FC<SpendingSparklineProps> = ({ totalSpentRub }) => {
  // 30 days data points representing actual and recent spending distribution
  const spendingHistory: SpendingPoint[] = [
    { day: 1, dateStr: '08 Сен', amount: 0, label: '0 ₽' },
    { day: 2, dateStr: '09 Сен', amount: 0, label: '0 ₽' },
    { day: 3, dateStr: '10 Сен', amount: 490, label: 'Благословение Луны' },
    { day: 4, dateStr: '11 Сен', amount: 0, label: '0 ₽' },
    { day: 5, dateStr: '12 Сен', amount: 0, label: '0 ₽' },
    { day: 6, dateStr: '13 Сен', amount: 1200, label: 'Steam KZ Пополнение' },
    { day: 7, dateStr: '14 Сен', amount: 0, label: '0 ₽' },
    { day: 8, dateStr: '15 Сен', amount: 0, label: '0 ₽' },
    { day: 9, dateStr: '16 Сен', amount: 0, label: '0 ₽' },
    { day: 10, dateStr: '17 Сен', amount: 750, label: 'V-Bucks Fortnite' },
    { day: 11, dateStr: '18 Сен', amount: 0, label: '0 ₽' },
    { day: 12, dateStr: '19 Сен', amount: 0, label: '0 ₽' },
    { day: 13, dateStr: '20 Сен', amount: 0, label: '0 ₽' },
    { day: 14, dateStr: '21 Сен', amount: 1950, label: 'Steam Wallet Global' },
    { day: 15, dateStr: '22 Сен', amount: 0, label: '0 ₽' },
    { day: 16, dateStr: '23 Сен', amount: 0, label: '0 ₽' },
    { day: 17, dateStr: '24 Сен', amount: 0, label: '0 ₽' },
    { day: 18, dateStr: '25 Сен', amount: 4890, label: 'PS Plus Deluxe 12 мес' },
    { day: 19, dateStr: '26 Сен', amount: 0, label: '0 ₽' },
    { day: 20, dateStr: '27 Сен', amount: 0, label: '0 ₽' },
    { day: 21, dateStr: '28 Сен', amount: 390, label: 'Донат HoYoverse' },
    { day: 22, dateStr: '29 Сен', amount: 0, label: '0 ₽' },
    { day: 23, dateStr: '30 Сен', amount: 0, label: '0 ₽' },
    { day: 24, dateStr: '01 Окт', amount: 0, label: '0 ₽' },
    { day: 25, dateStr: '02 Окт', amount: 0, label: '0 ₽' },
    { day: 26, dateStr: '03 Окт', amount: 0, label: '0 ₽' },
    { day: 27, dateStr: '04 Окт', amount: 0, label: '0 ₽' },
    { day: 28, dateStr: '05 Окт', amount: 1490, label: 'Кристаллы Сотворения' },
    { day: 29, dateStr: '06 Окт', amount: 0, label: '0 ₽' },
    { day: 30, dateStr: '07 Окт (Сегодня)', amount: 3290, label: 'Steam KZ Пополнение' },
  ];

  const [hoveredPoint, setHoveredPoint] = useState<SpendingPoint | null>(null);

  // SVG dimensions for responsive sparkline
  const width = 640;
  const height = 90;
  const paddingX = 16;
  const paddingY = 12;

  const maxVal = Math.max(...spendingHistory.map((d) => d.amount), 5000);

  // Compute coordinates for SVG path
  const points = spendingHistory.map((d, index) => {
    const x = paddingX + (index / (spendingHistory.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.amount / maxVal) * (height - paddingY * 2);
    return { ...d, x, y };
  });

  // Construct smooth line SVG path
  const pathD = points.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Construct filled area path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const totalPeriodSum = spendingHistory.reduce((s, p) => s + p.amount, 0);
  const activeDaysCount = spendingHistory.filter((p) => p.amount > 0).length;

  return (
    <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="text-xs text-[#9496A1] flex items-center gap-1.5 font-mono-tabular">
            <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
            Динамика расходов за последние 30 дней
          </div>
          <div className="text-base font-semibold text-[#F4F4F6] flex items-baseline gap-2">
            <span>Всего потрачено:</span>
            <span className="font-mono-tabular text-lg font-bold text-[#F4F4F6]">
              {totalSpentRub.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-xs text-[#10B981] font-mono-tabular">
              ({activeDaysCount} активных платежей)
            </span>
          </div>
        </div>

        {/* Hover inspection tooltip */}
        <div className="h-6 flex items-center">
          {hoveredPoint ? (
            <div className="text-xs bg-[#1C1F26] px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-2">
              <span className="text-[#9496A1]">{hoveredPoint.dateStr}:</span>
              <span className="font-semibold text-[#10B981] font-mono-tabular">
                {hoveredPoint.amount > 0 ? `${hoveredPoint.amount} ₽` : 'Без покупок'}
              </span>
              {hoveredPoint.amount > 0 && (
                <span className="text-[#9496A1]">· {hoveredPoint.label}</span>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-[#9496A1]">
              Наведите курсор на график для детализации по дням
            </div>
          )}
        </div>
      </div>

      {/* SVG Sparkline Canvas */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#131519]/70 border border-white/6 pt-2 pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-24 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#E11D48" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="60%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>

          {/* Background horizontal guideline */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="3 3"
          />

          {/* Area under curve */}
          <path d={areaD} fill="url(#spendGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineStrokeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt) => {
            const isHovered = hoveredPoint?.day === pt.day;
            const hasSpending = pt.amount > 0;

            return (
              <g
                key={pt.day}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer"
              >
                {/* Hit target transparent circle */}
                <circle cx={pt.x} cy={pt.y} r={10} fill="transparent" />

                {/* Visible dot on spending days */}
                {hasSpending && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3.5}
                    fill={isHovered ? '#FFFFFF' : '#E11D48'}
                    stroke="#131519"
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between items-center px-4 pt-1 text-[10px] text-[#9496A1] font-mono-tabular">
          <span>30 дней назад</span>
          <span>15 дней назад</span>
          <span className="text-[#F4F4F6]">Сегодня</span>
        </div>
      </div>
    </div>
  );
};
