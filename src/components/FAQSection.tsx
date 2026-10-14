import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, RotateCcw, Globe, Zap } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  highlight?: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'steam-login-diff',
    category: 'Пополнение Steam',
    question: 'Какой логин указывать для пополнения Steam — имя профиля или логин входа?',
    answer: 'Обязательно указывайте логин, который вы вводите при входе в клиент Steam (аккаунт), а не отображаемый никнейм (имя профиля в играх или чате). Узнать точный логин можно в правом верхнем углу клиента Steam: нажмите на аватарку -> «Об аккаунте» -> первая строчка «Аккаунт пользователя».',
    highlight: 'Указывайте логин входа, а не публичный никнейм.',
  },
  {
    id: 'delivery-speed',
    category: 'Скорость доставки',
    question: 'Как быстро зачисляются средства на аккаунт или доставляются ключи?',
    answer: 'Прямое пополнение Steam и внутриигровой донат по UID (Genshin, Honkai) поступают автоматически через прямой API-шлюз в среднем за 10–25 секунд после подтверждения оплаты по СБП или карте. Цифровые ключи и ваучеры (PS Plus, Xbox Game Pass, Riot Points) генерируются моментально на экране и дублируются на ваш email.',
    highlight: 'Среднее время доставки — 14 секунд.',
  },
  {
    id: 'instant-refund-policy',
    category: 'Возврат средств',
    question: 'Как работает мгновенный возврат средств на внутренний баланс?',
    answer: 'Если вы ошиблись регионом, указали неверный UID или приобретенный цифровой ключ еще не был активирован, вам не нужно открывать долгий спор в банке (чарджбэк длится до 30 дней). Перейдите в Личный кабинет -> раздел «Заказы и 1-Клик Возврат» и нажмите кнопку «Вернуть на баланс». 100% оплаченной суммы моментально зачислится на ваш внутренний счет LevelUp, и вы сможете сразу оформить правильный заказ.',
    highlight: '100% суммы возвращается за 1 клик без банковских комиссий.',
  },
  {
    id: 'regions-currencies',
    category: 'Регионы и конвертация',
    question: 'Какие регионы Steam и PlayStation поддерживаются? Как происходит конвертация?',
    answer: 'Мы поддерживаем аккаунты России (RUB), Казахстана (KZT), Турции (USD-MENA), Украины (UAH) и стран СНГ. Вы платите в рублях (через СБП, Т-Банк, Сбер, карты МИР), а сумма на баланс кошелька Steam зачисляется в валюте вашего аккаунта по официальному межбанковскому курсу. На шаге расчета калькулятор сразу показывает точную сумму, которая поступит на ваш баланс.',
    highlight: 'Поддерживаются регионы RU, KZ, TR, UA, Global без скрытых наценок.',
  },
  {
    id: 'smart-split-cashback',
    category: 'Кэшбэк и Smart Split',
    question: 'Как работает кэшбэк и можно ли комбинировать оплату с внутреннего баланса и карты?',
    answer: 'В LevelUp действует функция «Smart Split»: вы можете списать накопленный кэшбэк и возвратный баланс (вплоть до 100% стоимости), а недостающую часть доплатить картой или через СБП. Кэшбэк начисляется живыми рублями (1 бонус = 1 ₽) за каждую покупку в соответствии с вашим уровнем лояльности (от 2% до 7%).',
    highlight: '1 рубль кэшбэка = 1 рубль скидки. Сгорания бонусов нет.',
  },
  {
    id: 'genshin-uid-safety',
    category: 'Безопасность доната',
    question: 'Безопасно ли пополнять игры по UID? Нужен ли пароль от аккаунта?',
    answer: 'Для пополнения игр HoYoverse (Genshin Impact, Honkai: Star Rail) пароль НЕ требуется. Мы используем официальные партнерские каналы пополнения исключительно по вашему игровому UID и серверу. Это на 100% безопасно, исключает риск блокировок и сохраняет официальный бонус первого пополнения (х2 кристаллов).',
    highlight: 'Пароли и доступы к аккаунтам никогда не запрашиваются.',
  },
  {
    id: 'mobile-pubg-mlbb-info',
    category: 'Мобильные игры',
    question: 'Как пополнять PUBG Mobile и Mobile Legends: Bang Bang? Где взять ID?',
    answer: 'В PUBG Mobile валюта UC зачисляется по цифровому Player ID (число из 8–11 цифр в вашем профиле). В Mobile Legends требуется указать User ID и Zone ID в скобках (например, 542019482 (6210)), которые указаны в меню аватара в игре. Данные для входа в аккаунт не требуются, зачисление происходит автоматически за 10–20 секунд.',
    highlight: 'Мгновенное зачисление UC и Алмазов только по ID без входа в аккаунт.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([FAQ_DATA[0].id, FAQ_DATA[2].id]);
  const [activeFilter, setActiveFilter] = useState<string>('Все');

  const categories = ['Все', 'Пополнение Steam', 'Возврат средств', 'Регионы и конвертация', 'Безопасность доната'];

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = FAQ_DATA.filter((item) =>
    activeFilter === 'Все' ? true : item.category === activeFilter
  );

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-16 border-t border-white/8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="text-xs text-[#9496A1] tracking-wide flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#10B981]" />
            База знаний и гарантии сервиса · LevelUp Transparency
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F4F6] font-display"
            style={{ textWrap: 'balance' }}
          >
            Часто задаваемые вопросы о пополнениях, регионах и возврате
          </h2>
          <p className="text-sm text-[#9496A1] max-w-[65ch]">
            Все ключевые правила работы сервиса: от ввода логина до моментального зачисления средств и мгновенного манибэка на внутренний баланс.
          </p>
        </div>

        {/* Quick Filter Pills/Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131519] border border-white/8 rounded-xl overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFilter === cat
                  ? 'bg-[#1C1F26] text-[#F4F4F6] shadow-xs'
                  : 'text-[#9496A1] hover:text-[#F4F4F6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#131519] border-white/20 shadow-sm'
                  : 'bg-[#0B0C0E] border-white/8 hover:border-white/15'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-[#10B981] font-mono-tabular">
                    {faq.category}
                  </div>
                  <h3 className="text-sm sm:text-[15px] font-semibold text-[#F4F4F6] leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`p-1.5 rounded-lg bg-white/5 text-[#9496A1] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-white' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-white/6 text-xs sm:text-[13px] text-[#9496A1] leading-relaxed space-y-3">
                  <p>{faq.answer}</p>
                  {faq.highlight && (
                    <div className="p-2.5 rounded-lg bg-[#1C1F26] border border-white/8 text-[12px] text-[#F4F4F6] flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span>{faq.highlight}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust & Support Footer Strip */}
      <div className="mt-8 p-5 rounded-xl bg-[#131519] border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#F4F4F6]">
              Остались вопросы по платежу или активации?
            </div>
            <div className="text-xs text-[#9496A1]">
              Поддержка работает 24/7 в Telegram и онлайн-чате с живыми операторами.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-[#1C1F26] hover:bg-white/15 text-xs font-semibold text-[#F4F4F6] transition-colors"
          >
            Написать в Telegram Support
          </a>
        </div>
      </div>
    </section>
  );
};
