import React, { useState, useEffect } from 'react';
import { RotateCcw, ArrowUpRight, CheckCircle2, Sun, Moon } from 'lucide-react';
import { HeroPromoBanner } from './components/HeroPromoBanner';
import { SteamTopUpWidget } from './components/SteamTopUpWidget';
import { MarketplaceCatalog } from './components/MarketplaceCatalog';
import { ProductCheckoutModal } from './components/ProductCheckoutModal';
import { UserCabinetModal } from './components/UserCabinetModal';
import { FAQSection } from './components/FAQSection';
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  INITIAL_ORDERS,
  LOYALTY_TIERS,
  OrderRecord,
  PriceDropAlert,
  RegionRate,
  SharedPot,
  ReferralFriend,
} from './data/storeData';

export function App() {
  const [vaultBalanceRub, setVaultBalanceRub] = useState<number>(650);
  const [cashbackBalanceRub, setCashbackBalanceRub] = useState<number>(340);
  const [totalSpentRub, setTotalSpentRub] = useState<number>(9670);

  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  const [referrals, setReferrals] = useState<ReferralFriend[]>([
    {
      id: 'ref-1',
      name: 'Денис (@denis_cs)',
      date: 'Вчера, 16:30',
      status: 'completed_first_topup',
      firstTopUpAmountRub: 1500,
      rewardEarnedRub: 200,
    },
    {
      id: 'ref-2',
      name: 'Илья (@ilya_gamer)',
      date: 'Сегодня, 11:15',
      status: 'completed_first_topup',
      firstTopUpAmountRub: 2150,
      rewardEarnedRub: 200,
    },
    {
      id: 'ref-3',
      name: 'Максим (@max_play)',
      date: 'Сегодня, 14:02',
      status: 'registered',
      rewardEarnedRub: 0,
    },
  ]);

  const [savedAccounts, setSavedAccounts] = useState<
    { label: string; login: string; regionId: RegionRate['id'] }[]
  >([
    { label: 'Основа КЗ', login: 'kratos_main_kz', regionId: 'KZ' },
    { label: 'Аккаунт РФ', login: 'stalker_ru_01', regionId: 'RU' },
    { label: 'Твинк Турция', login: 'night_city_tr', regionId: 'TR' },
  ]);

  const [sharedPots, setSharedPots] = useState<SharedPot[]>([
    {
      id: 'pot-1',
      recipientName: 'Артем (@artem_dota)',
      goalTitle: 'Подарок на ДР: PlayStation Plus Deluxe 12 Месяцев',
      targetAmountRub: 4890,
      currentAmountRub: 3400,
      shareCode: 'LP-GIFT-882',
      contributors: [
        { name: 'Денис', amountRub: 1500, date: 'Вчера' },
        { name: 'Илья', amountRub: 1000, date: 'Сегодня' },
        { name: 'Вы', amountRub: 900, date: 'Сегодня' },
      ],
    },
  ]);

  const [priceAlerts, setPriceAlerts] = useState<PriceDropAlert[]>([
    {
      id: 'ps-plus-deluxe',
      productTitle: 'PlayStation Plus Deluxe — 12 Месяцев',
      currentPriceRub: 4890,
      targetPriceRub: 4400,
      notifyTelegram: true,
      active: true,
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [cabinetOpen, setCabinetOpen] = useState<boolean>(false);
  const [cabinetInitialTab, setCabinetInitialTab] = useState<
    'overview' | 'orders' | 'loyalty' | 'pots' | 'alerts' | 'referrals'
  >('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme preference with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('levelup_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {
      // ignore
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('levelup_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(nextTheme === 'light' ? 'Включена светлая контрастная тема' : 'Включена темная тема');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const currentTier =
    [...LOYALTY_TIERS].reverse().find((t) => totalSpentRub >= t.minSpentRub) ||
    LOYALTY_TIERS[0];

  const deductInternalFunds = (amountToDeduct: number) => {
    if (amountToDeduct <= 0) return;
    const fromCashback = Math.min(cashbackBalanceRub, amountToDeduct);
    const remainingFromVault = amountToDeduct - fromCashback;
    setCashbackBalanceRub((prev) => prev - fromCashback);
    setVaultBalanceRub((prev) => Math.max(0, prev - remainingFromVault));
  };

  const handleCompleteSteamTopUp = (payload: {
    login: string;
    region: RegionRate;
    receiveAmountForeign: number;
    totalPayRub: number;
    usedVaultRub: number;
    earnedCashbackRub: number;
  }) => {
    deductInternalFunds(payload.usedVaultRub);
    setCashbackBalanceRub((prev) => prev + payload.earnedCashbackRub);
    setTotalSpentRub((prev) => prev + payload.totalPayRub + payload.usedVaultRub);

    const newOrder: OrderRecord = {
      id: `LP-${Math.floor(90500 + Math.random() * 900)}`,
      date: 'Только что',
      title: `Пополнение Steam (${payload.receiveAmountForeign} ${payload.region.currencySymbol})`,
      platform: 'Steam',
      targetAccount: payload.login,
      region: payload.region.name,
      amountPaidRub: payload.totalPayRub + payload.usedVaultRub,
      usedVaultRub: payload.usedVaultRub,
      cashbackEarned: payload.earnedCashbackRub,
      status: 'completed',
      canRefundToVault: true,
      refundReason:
        'Доступна отмена транзакции в течение 15 минут с мгновенным возвратом 100% суммы в баланс LevelUp.',
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(
      `Steam (${payload.login}) пополнен! Начислено +${payload.earnedCashbackRub} ₽ кэшбэка.`
    );
  };

  const handleCompleteProductOrder = (payload: {
    product: CatalogProduct;
    variantLabel: string;
    targetAccount: string;
    totalPayRub: number;
    usedVaultRub: number;
    earnedCashbackRub: number;
  }) => {
    deductInternalFunds(payload.usedVaultRub);
    setCashbackBalanceRub((prev) => prev + payload.earnedCashbackRub);
    setTotalSpentRub((prev) => prev + payload.totalPayRub + payload.usedVaultRub);

    const newOrder: OrderRecord = {
      id: `LP-${Math.floor(90500 + Math.random() * 900)}`,
      date: 'Только что',
      title: `${payload.product.title} (${payload.variantLabel})`,
      platform: payload.product.platform,
      targetAccount: payload.targetAccount,
      region: payload.product.region,
      amountPaidRub: payload.totalPayRub + payload.usedVaultRub,
      usedVaultRub: payload.usedVaultRub,
      cashbackEarned: payload.earnedCashbackRub,
      status: 'completed',
      canRefundToVault: true,
      refundReason:
        'Ключ еще не раскрыт — доступен моментальный возврат 100% средств на внутренний баланс.',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedProduct(null);
    showToast(
      `Заказ #${newOrder.id} оформлен! +${payload.earnedCashbackRub} ₽ зачислено в кэшбэк.`
    );
  };

  const handleRefundOrderToVault = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target || !target.canRefundToVault) return;

    setVaultBalanceRub((prev) => prev + target.amountPaidRub);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'refunded_to_vault', canRefundToVault: false }
          : o
      )
    );
    showToast(
      `Возврат выполнен: +${target.amountPaidRub.toLocaleString('ru-RU')} ₽ зачислены на баланс LevelUp.`
    );
  };

  const handleTopUpVaultDirect = (amountRub: number) => {
    setVaultBalanceRub((prev) => prev + amountRub);
    showToast(`Баланс LevelUp пополнен на +${amountRub} ₽.`);
  };

  const handleTogglePriceAlert = (product: CatalogProduct) => {
    const exists = priceAlerts.some((a) => a.id === product.id);
    if (exists) {
      setPriceAlerts((prev) => prev.filter((a) => a.id !== product.id));
      showToast(`Отслеживание цены для «${product.title}» отключено.`);
    } else {
      setPriceAlerts((prev) => [
        ...prev,
        {
          id: product.id,
          productTitle: product.title,
          currentPriceRub: product.priceRub,
          targetPriceRub: Math.round(product.priceRub * 0.9),
          notifyTelegram: true,
          active: true,
        },
      ]);
      showToast(
        `Радар цен включен: сообщим, когда «${product.title}» подешевеет.`
      );
    }
  };

  const handleContributeToPot = (
    potId: string,
    amountRub: number,
    contributorName: string
  ) => {
    if (vaultBalanceRub >= amountRub) {
      setVaultBalanceRub((prev) => prev - amountRub);
    }
    setSharedPots((prev) =>
      prev.map((pot) =>
        pot.id === potId
          ? {
              ...pot,
              currentAmountRub: Math.min(pot.targetAmountRub, pot.currentAmountRub + amountRub),
              contributors: [
                ...pot.contributors,
                { name: contributorName, amountRub, date: 'Только что' },
              ],
            }
          : pot
      )
    );
    showToast(`Вы внесли ${amountRub} ₽ в сбор!`);
  };

  const handleCreateSharedPot = (
    title: string,
    recipient: string,
    targetRub: number
  ) => {
    const newPot: SharedPot = {
      id: `pot-${Date.now()}`,
      recipientName: recipient,
      goalTitle: title,
      targetAmountRub: targetRub,
      currentAmountRub: 0,
      shareCode: `LP-GIFT-${Math.floor(100 + Math.random() * 899)}`,
      contributors: [],
    };
    setSharedPots((prev) => [newPot, ...prev]);
    showToast(`Совместный сбор «${title}» открыт!`);
  };

  const handleSimulateFriendInvite = (friendName: string) => {
    const newFriend: ReferralFriend = {
      id: `ref-${Date.now()}`,
      name: friendName,
      date: 'Только что',
      status: 'completed_first_topup',
      firstTopUpAmountRub: 1200,
      rewardEarnedRub: 200,
    };
    setReferrals((prev) => [newFriend, ...prev]);
    setCashbackBalanceRub((prev) => prev + 200);
    showToast(`Друг ${friendName} совершил первый заказ! Вам начислено +200 ₽ бонусного кэшбэка.`);
  };

  const openCabinetTab = (
    tab: 'overview' | 'orders' | 'loyalty' | 'pots' | 'alerts' | 'referrals'
  ) => {
    setCabinetInitialTab(tab);
    setCabinetOpen(true);
  };

  const refundableCount = orders.filter((o) => o.canRefundToVault).length;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-[#F4F5F8] text-[#0F172A]'
          : 'bg-[#0B0C0E] text-[#F4F4F6]'
      }`}
    >
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-white/90 border-slate-200 shadow-xs'
            : 'bg-[#0B0C0E]/90 border-white/8'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <a
            href="#top"
            className={`text-xl font-bold tracking-tight font-display whitespace-nowrap shrink-0 ${
              theme === 'light' ? 'text-[#0F172A]' : 'text-[#F4F4F6]'
            }`}
          >
            LevelUp Payments
          </a>

          <nav
            className={`hidden md:flex items-center gap-7 text-sm font-medium ${
              theme === 'light' ? 'text-slate-600' : 'text-[#9496A1]'
            }`}
          >
            <a
              href="#top"
              className="hover:text-[#F4F4F6] transition-colors whitespace-nowrap"
            >
              Пополнение Steam
            </a>
            <a
              href="#catalog-section"
              className="hover:text-[#F4F4F6] transition-colors whitespace-nowrap"
            >
              Каталог и Донат
            </a>
            <button
              type="button"
              onClick={() => openCabinetTab('orders')}
              className="hover:text-[#F4F4F6] transition-colors whitespace-nowrap cursor-pointer"
            >
              Возврат в 1 клик ({refundableCount})
            </button>
            <button
              type="button"
              onClick={() => openCabinetTab('loyalty')}
              className="hover:text-[#F4F4F6] transition-colors whitespace-nowrap cursor-pointer"
            >
              Кэшбэк до 7%
            </button>
            <button
              type="button"
              onClick={() => openCabinetTab('pots')}
              className="hover:text-[#F4F4F6] transition-colors whitespace-nowrap cursor-pointer"
            >
              Сборы на подарки
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
              aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
              className="p-2 rounded-lg bg-[#131519] hover:bg-[#1C1F26] border border-white/12 text-[#9496A1] hover:text-[#F4F4F6] transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#3B82F6]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => openCabinetTab('overview')}
              className="px-4 py-2 rounded-lg bg-[#131519] hover:bg-[#1C1F26] border border-white/12 text-xs font-semibold text-[#F4F4F6] transition-colors whitespace-nowrap cursor-pointer font-mono-tabular"
            >
              Кабинет · {(vaultBalanceRub + cashbackBalanceRub).toLocaleString('ru-RU')} ₽
            </button>
          </div>
        </div>
      </header>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#131519] border border-[#10B981]/50 text-[#F4F4F6] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      <main id="top" className="flex-1">
        {/* Visually striking Hero Banner for Promotions, Game Deals and CTAs */}
        <HeroPromoBanner
          onStartTopUp={() => {
            const el = document.getElementById('topup-calculator');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreDeals={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCabinet={() => openCabinetTab('loyalty')}
          onSelectGameDeal={(dealKey) => {
            const targetProd = CATALOG_PRODUCTS.find((p) => p.id.includes(dealKey));
            if (targetProd) setSelectedProduct(targetProd);
          }}
        />

        <div id="topup-calculator">
          <SteamTopUpWidget
            vaultBalanceRub={vaultBalanceRub}
            cashbackBalanceRub={cashbackBalanceRub}
            loyaltyDiscountPercent={currentTier.commissionDiscount}
            loyaltyCashbackPercent={currentTier.cashbackRate}
            savedAccounts={savedAccounts}
            onCompleteTopUp={handleCompleteSteamTopUp}
          />
        </div>

        <MarketplaceCatalog
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddPriceAlert={handleTogglePriceAlert}
          alertedProductIds={priceAlerts.map((a) => a.id)}
        />

        <section className="max-w-[1280px] mx-auto px-6 py-16 border-t border-white/8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs text-[#9496A1]">
                Преимущества платформы · LevelUp Ecosystem
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[#F4F4F6] tracking-tight leading-snug"
                style={{ textWrap: 'balance' }}
              >
                Новый стандарт пополнения и покупок цифровых игр
              </h2>
              <p className="text-sm text-[#9496A1] leading-relaxed">
                Никаких долгих ожиданий при ошибках в логине или регионе. Мгновенный манибэк, кэшбэк на каждый заказ и удобный внутренний баланс.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openCabinetTab('orders')}
                  className="px-4 py-2.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Возврат в 1 клик ({refundableCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => openCabinetTab('loyalty')}
                  className="px-4 py-2.5 rounded-lg bg-[#131519] hover:bg-[#1C1F26] border border-white/10 text-xs font-semibold text-[#F4F4F6] transition-colors cursor-pointer"
                >
                  Уровни кэшбэка
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[#131519] border border-white/8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-[#10B981] font-mono-tabular">
                    01. Мгновенный манибэк
                  </div>
                  <h3 className="text-base font-bold text-[#F4F4F6]">
                    Возврат средств за 1 секунду
                  </h3>
                  <p className="text-xs text-[#9496A1] leading-relaxed">
                    Ошиблись сервером или регионом? Не нужно ждать неделями возврат на карту — 100% суммы переводится на внутренний баланс сразу.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCabinetTab('orders')}
                  className="text-xs font-semibold text-[#F4F4F6] hover:text-[#E11D48] flex items-center gap-1 transition-colors w-fit cursor-pointer"
                >
                  <span>История заказов</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 rounded-xl bg-[#131519] border border-white/8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs text-[#10B981] font-mono-tabular">
                    02. Smart Split и кэшбэк
                  </div>
                  <h3 className="text-base font-bold text-[#F4F4F6]">
                    Кэшбэк до 7% и сниженная комиссия
                  </h3>
                  <p className="text-xs text-[#9496A1] leading-relaxed">
                    Комбинируйте оплату с внутреннего счета с СБП или картой в удобной пропорции.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCabinetTab('loyalty')}
                  className="text-xs font-semibold text-[#F4F4F6] hover:text-[#E11D48] flex items-center gap-1 transition-colors w-fit cursor-pointer"
                >
                  <span>Статус: {currentTier.name} ({currentTier.cashbackRate}%)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 rounded-xl bg-[#131519] border border-white/8 flex flex-col justify-between space-y-4 sm:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="text-xs text-[#F59E0B] font-mono-tabular">
                      03. Совместные подарки
                    </div>
                    <h3 className="text-base font-bold text-[#F4F4F6]">
                      Скидывайтесь с друзьями на любые игры прямо в сервисе
                    </h3>
                    <p className="text-xs text-[#9496A1] leading-relaxed">
                      Создайте цель сбора, делитесь кодом с друзьями и оплачивайте долю со своего баланса.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCabinetTab('pots')}
                    className="px-4 py-2.5 rounded-lg bg-[#1C1F26] hover:bg-white/15 text-xs font-semibold text-[#F4F4F6] whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                  >
                    Совместные сборы
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Base & FAQ Section for Building Trust and Clarifying Rules */}
        <FAQSection />
      </main>

      <footer
        className={`border-t py-10 transition-colors duration-200 ${
          theme === 'light'
            ? 'bg-white border-slate-200 text-slate-500'
            : 'bg-[#0B0C0E] border-white/8 text-[#9496A1]'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
          <div className="space-y-1">
            <div
              className={`font-bold font-display text-sm ${
                theme === 'light' ? 'text-slate-900' : 'text-[#F4F4F6]'
              }`}
            >
              LevelUp Payments
            </div>
            <div>
              Цифровой маркетплейс пополнения игр и подписок с системой мгновенного возврата на внутренний баланс.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => openCabinetTab('overview')}
              className={`transition-colors cursor-pointer ${
                theme === 'light' ? 'hover:text-slate-900' : 'hover:text-[#F4F4F6]'
              }`}
            >
              Личный кабинет
            </button>
            <button
              type="button"
              onClick={() => openCabinetTab('orders')}
              className={`transition-colors cursor-pointer ${
                theme === 'light' ? 'hover:text-slate-900' : 'hover:text-[#F4F4F6]'
              }`}
            >
              Мгновенный возврат
            </button>
            <button
              type="button"
              onClick={() => openCabinetTab('loyalty')}
              className={`transition-colors cursor-pointer ${
                theme === 'light' ? 'hover:text-slate-900' : 'hover:text-[#F4F4F6]'
              }`}
            >
              Программа лояльности
            </button>
            <span>© 2026 LevelUp Payments</span>
          </div>
        </div>
      </footer>

      <ProductCheckoutModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        vaultBalanceRub={vaultBalanceRub}
        cashbackBalanceRub={cashbackBalanceRub}
        onCompleteOrder={handleCompleteProductOrder}
      />

      <UserCabinetModal
        isOpen={cabinetOpen}
        onClose={() => setCabinetOpen(false)}
        initialTab={cabinetInitialTab}
        vaultBalanceRub={vaultBalanceRub}
        cashbackBalanceRub={cashbackBalanceRub}
        totalSpentRub={totalSpentRub}
        orders={orders}
        onRefundOrderToVault={handleRefundOrderToVault}
        onTopUpVaultDirect={handleTopUpVaultDirect}
        savedAccounts={savedAccounts}
        onAddSavedAccount={(acc) => setSavedAccounts((prev) => [...prev, acc])}
        onRemoveSavedAccount={(login) =>
          setSavedAccounts((prev) => prev.filter((a) => a.login !== login))
        }
        sharedPots={sharedPots}
        onContributeToPot={handleContributeToPot}
        onCreateSharedPot={handleCreateSharedPot}
        priceAlerts={priceAlerts}
        onRemovePriceAlert={(id) =>
          setPriceAlerts((prev) => prev.filter((a) => a.id !== id))
        }
        referrals={referrals}
        onSimulateFriendInvite={handleSimulateFriendInvite}
      />
    </div>
  );
}

export default App;
