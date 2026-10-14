import React, { useState } from 'react';
import { ArrowRight, Sparkles, Flame, ShieldAlert, ArrowUpRight, Gift } from 'lucide-react';
import promoHeroImg from '../assets/images/hero_promo_cyber_gaming_1791441328278.jpg';

interface HeroPromoBannerProps {
  onStartTopUp: () => void;
  onExploreDeals: () => void;
  onOpenCabinet: () => void;
  onSelectGameDeal: (dealKey: string) => void;
}

export const HeroPromoBanner: React.FC<HeroPromoBannerProps> = ({
  onStartTopUp,
  onExploreDeals,
  onOpenCabinet,
  onSelectGameDeal,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const featuredDeals = [
    {
      id: 'steam-promo',
      badge: 'Хит сезона · Комиссия 0% на первый заказ',
      title: 'Весенний сезон пополнений Steam',
      subtitle: 'Мгновенное зачисление в тенге, лирах и рублях с повышенным кэшбэком 7% для новых игроков',
      tag: 'Steam Global & CIS',
      code: 'FIRSTVAULT',
      accentColor: '#10B981',
      ctaText: 'Пополнить Steam за 15 сек',
      action: onStartTopUp,
    },
    {
      id: 'psn-promo',
      badge: 'Эксклюзив · Скидки на подписки',
      title: 'PlayStation Plus Deluxe & Extra',
      subtitle: 'Годовые подписки для регионов Турция, Украина и Индия с прямой активацией без посредников',
      tag: 'PS Store 12 мес',
      code: 'PSNDELUXE',
      accentColor: '#3B82F6',
      ctaText: 'Выбрать подписку PSN',
      action: onExploreDeals,
    },
    {
      id: 'genshin-promo',
      badge: 'Донат по UID · Без входа',
      title: 'Genshin Impact & HoYoverse Паки',
      subtitle: 'Благословение Луны и Кристаллы Сотворения с гарантией сохранения бонуса первого пополнения',
      tag: 'UID Direct Delivery',
      code: 'LUNAPACK',
      accentColor: '#F59E0B',
      ctaText: 'Забрать кристаллы',
      action: onExploreDeals,
    },
  ];

  const currentDeal = featuredDeals[activeSlide];

  return (
    <section className="relative max-w-[1280px] mx-auto px-6 pt-6 pb-2">
      {/* Visual Container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#131519]">
        {/* Background Graphic Asset with High-Contrast Editorial Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={promoHeroImg}
            alt="LevelUp Gaming Promotions"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-102 transition-transform duration-700"
          />
          {/* Multi-stage measured contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-transparent" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 lg:p-12 items-center">
          {/* Main Editorial Pitch */}
          <div className="lg:col-span-8 space-y-6">
            {/* Editorial Kicker & Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-[#10B981] font-mono-tabular">
                <Sparkles className="w-3.5 h-3.5" />
                {currentDeal.badge}
              </span>
              <span className="text-[#9496A1]" aria-hidden="true">·</span>
              <span className="text-[#9496A1]">Промокод:</span>
              <span className="font-mono-tabular px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                {currentDeal.code}
              </span>
              <span className="text-[#9496A1]" aria-hidden="true">·</span>
              <span className="text-[#9496A1]">100% возврат на баланс в 1 клик</span>
            </div>

            {/* Display Headline */}
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F4F6] font-display leading-[1.12]"
              style={{ textWrap: 'balance' }}
            >
              {currentDeal.title}
            </h1>

            {/* Description */}
            <p className="text-[15px] sm:text-base text-[#9496A1] leading-relaxed max-w-[64ch]">
              {currentDeal.subtitle}
            </p>

            {/* Dual CTAs & Key Trust Indicators */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={currentDeal.action}
                className="py-3.5 px-6 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E11D48]/20"
              >
                <span>{currentDeal.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenCabinet}
                className="py-3.5 px-6 rounded-xl bg-[#1C1F26] hover:bg-white/15 text-[#F4F4F6] border border-white/10 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#10B981]" />
                <span>Бонусы и Личный кабинет</span>
              </button>
            </div>

            {/* Micro Trust Bullets */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-[#9496A1]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Мгновенное СБП и карты МИР
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Конвертация по биржевому курсу
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Защита от сбоев LevelUp Shield
              </span>
            </div>
          </div>

          {/* Right Bento Box: Popular Hot Deals Micro-Cards */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-[#9496A1] pb-1">
              <span className="flex items-center gap-1 text-[#F4F4F6] font-semibold">
                <Flame className="w-3.5 h-3.5 text-[#E11D48]" /> Горячие предложения
              </span>
              <span>{activeSlide + 1} из {featuredDeals.length}</span>
            </div>

            {featuredDeals.map((deal, idx) => {
              const isSelected = activeSlide === idx;
              return (
                <div
                  key={deal.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1C1F26] border-[#E11D48] text-[#F4F4F6] shadow-sm'
                      : 'bg-[#0B0C0E]/80 border-white/8 text-[#9496A1] hover:text-[#F4F4F6] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold" style={{ color: deal.accentColor }}>
                      {deal.tag}
                    </span>
                    <span className="font-mono-tabular text-xs">
                      {isSelected ? 'Активно' : 'Выбрать'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#F4F4F6] line-clamp-1">
                    {deal.title}
                  </div>
                  <div className="text-[11px] text-[#9496A1] mt-0.5 line-clamp-1">
                    {deal.badge}
                  </div>
                </div>
              );
            })}

            {/* Slide Navigation Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {featuredDeals.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveSlide(dotIdx)}
                  aria-label={`Перейти к слайду ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide === dotIdx ? 'w-6 bg-[#E11D48]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
