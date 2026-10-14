import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, RefreshCw, Lock } from 'lucide-react';
import { STEAM_REGIONS, HERO_IMAGE, RegionRate } from '../data/storeData';

interface SteamTopUpWidgetProps {
  vaultBalanceRub: number;
  cashbackBalanceRub: number;
  loyaltyDiscountPercent: number;
  loyaltyCashbackPercent: number;
  savedAccounts: { label: string; login: string; regionId: RegionRate['id'] }[];
  onCompleteTopUp: (payload: {
    login: string;
    region: RegionRate;
    receiveAmountForeign: number;
    totalPayRub: number;
    usedVaultRub: number;
    earnedCashbackRub: number;
  }) => void;
}

export const SteamTopUpWidget: React.FC<SteamTopUpWidgetProps> = ({
  vaultBalanceRub,
  cashbackBalanceRub,
  loyaltyDiscountPercent,
  loyaltyCashbackPercent,
  savedAccounts,
  onCompleteTopUp,
}) => {
  const [login, setLogin] = useState('kratos_main_kz');
  const [selectedRegionId, setSelectedRegionId] = useState<RegionRate['id']>('KZ');
  const [amountRubInput, setAmountRubInput] = useState<number>(2000);
  const [useVaultSplit, setUseVaultSplit] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'sbp' | 'mir' | 'vault_only'>('sbp');
  const [checkState, setCheckState] = useState<'idle' | 'checking' | 'verified'>('verified');
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  const activeRegion = STEAM_REGIONS.find((r) => r.id === selectedRegionId) || STEAM_REGIONS[0];
  const effectiveCommission = Math.max(1.9, Number((activeRegion.commissionBase - loyaltyDiscountPercent).toFixed(1)));

  const netRubToSteam = Math.round(amountRubInput * (1 - effectiveCommission / 100));
  const receiveForeign =
    activeRegion.id === 'RU'
      ? netRubToSteam
      : Number((netRubToSteam / activeRegion.rateToRub).toFixed(activeRegion.id === 'TR' ? 2 : 0));

  const totalAvailableInternal = vaultBalanceRub + cashbackBalanceRub;
  const appliedVaultRub = useVaultSplit ? Math.min(amountRubInput, totalAvailableInternal) : 0;
  const finalCardPayRub = Math.max(0, amountRubInput - appliedVaultRub);
  const earnedCashbackRub = Math.round(amountRubInput * (loyaltyCashbackPercent / 100));

  const handleVerifyAccount = () => {
    if (!login.trim()) return;
    setCheckState('checking');
    setTimeout(() => {
      setCheckState('verified');
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim() || amountRubInput < 100) return;

    onCompleteTopUp({
      login: login.trim(),
      region: activeRegion,
      receiveAmountForeign: receiveForeign,
      totalPayRub: finalCardPayRub,
      usedVaultRub: appliedVaultRub,
      earnedCashbackRub,
    });

    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 3000);
  };

  const quickPresets = [500, 1000, 2000, 5000];

  return (
    <section className="max-w-[1280px] mx-auto px-6 pt-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Brand Statement & Hero Visual */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs text-[#9496A1] tracking-wide">
              Прямой шлюз пополнения · 0% на вывод в баланс · 15 сек зачисление
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F6] leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Пополнение Steam и цифровых сервисов с умным возвратом средств
            </h1>
            <p className="text-[15px] text-[#9496A1] leading-relaxed max-w-[62ch]">
              Оплачивайте рублями в любой регион, комбинируйте внутренний баланс с СБП и возвращайте 100% средств на аккаунт LevelUp в один клик при ошибке в логине или регионе.
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-white/8 bg-[#131519] aspect-16/9">
            <img
              src={HERO_IMAGE}
              alt="Игровая консоль и рабочее место"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-5">
              <div className="flex items-center justify-between text-xs text-[#9496A1] mb-1">
                <span>Защита транзакций LevelUp Shield</span>
                <span className="font-mono-tabular text-[#10B981]">Шлюзы РФ / КЗ / ТР активны</span>
              </div>
              <p className="text-sm font-semibold text-[#F4F4F6]">
                Мгновенный манибэк на внутренний баланс без ожидания банка
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/8 grid grid-cols-3 gap-4">
            <div>
              <div className="text-xl font-bold font-mono-tabular text-[#F4F4F6]">14.2 сек</div>
              <div className="text-xs text-[#9496A1] mt-0.5">Среднее время доставки в Steam</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono-tabular text-[#10B981]">до 7.0%</div>
              <div className="text-xs text-[#9496A1] mt-0.5">Живой кэшбэк рублями</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono-tabular text-[#F4F4F6]">100%</div>
              <div className="text-xs text-[#9496A1] mt-0.5">Возврат на баланс в 1 клик</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Steam Widget */}
        <div className="lg:col-span-7 bg-[#131519] border border-white/8 rounded-xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-white/8">
            <div>
              <h2 className="text-lg font-semibold text-[#F4F4F6]">
                Быстрое пополнение Steam Wallet
              </h2>
              <p className="text-xs text-[#9496A1] mt-0.5">
                Нужен только логин (не никнейм) · Автоматическая конвертация валют
              </p>
            </div>
            <div className="text-xs text-[#9496A1] font-mono-tabular">
              Комиссия: <span className="text-[#10B981] font-semibold">{effectiveCommission}%</span> (Скидка тира -{loyaltyDiscountPercent}%)
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {savedAccounts.length > 0 && (
              <div>
                <div className="text-xs text-[#9496A1] mb-2">Сохраненные аккаунты (1-клик выбор):</div>
                <div className="flex flex-wrap gap-2">
                  {savedAccounts.map((acc) => (
                    <button
                      key={acc.login}
                      type="button"
                      onClick={() => {
                        setLogin(acc.login);
                        setSelectedRegionId(acc.regionId);
                        setCheckState('verified');
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        login === acc.login
                          ? 'bg-[#1C1F26] border-[#E11D48] text-[#F4F4F6]'
                          : 'bg-[#0B0C0E] border-white/8 text-[#9496A1] hover:text-[#F4F4F6]'
                      }`}
                    >
                      {acc.label} · {acc.login} ({acc.regionId})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7">
                <label className="block text-xs text-[#9496A1] mb-2">
                  Логин аккаунта Steam
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => {
                      setLogin(e.target.value);
                      setCheckState('idle');
                    }}
                    onBlur={handleVerifyAccount}
                    placeholder="Логин для входа в Steam"
                    className="w-full bg-[#0B0C0E] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#F4F4F6] placeholder-[#9496A1]/50 focus:outline-none focus:border-[#E11D48] font-mono-tabular"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    className="absolute right-2.5 text-xs text-[#9496A1] hover:text-[#F4F4F6] px-2 py-1"
                    title="Проверить аккаунт"
                  >
                    {checkState === 'checking' ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#F59E0B]" />
                    ) : checkState === 'verified' ? (
                      <span className="flex items-center gap-1 text-[#10B981]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Найден
                      </span>
                    ) : (
                      <span>Проверить</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs text-[#9496A1] mb-2">
                  Регион кошелька
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#0B0C0E] border border-white/8 rounded-lg">
                  {STEAM_REGIONS.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => setSelectedRegionId(reg.id)}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                        selectedRegionId === reg.id
                          ? 'bg-[#1C1F26] text-[#F4F4F6] shadow-xs'
                          : 'text-[#9496A1] hover:text-[#F4F4F6]'
                      }`}
                    >
                      {reg.id} ({reg.currencySymbol})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[#9496A1] mb-2">
                <span>Сумма пополнения (в рублях)</span>
                <span>{activeRegion.note}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-6 relative">
                  <input
                    type="number"
                    min={100}
                    max={150000}
                    step={50}
                    value={amountRubInput}
                    onChange={(e) => setAmountRubInput(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-[#0B0C0E] border border-white/10 rounded-lg px-3.5 py-2.5 text-base font-semibold text-[#F4F4F6] focus:outline-none focus:border-[#E11D48] font-mono-tabular"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#9496A1] font-mono-tabular">
                    ₽
                  </span>
                </div>
                <div className="sm:col-span-6 grid grid-cols-4 gap-2">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountRubInput(preset)}
                      className={`py-2 px-2 text-xs font-mono-tabular rounded-lg border transition-colors whitespace-nowrap ${
                        amountRubInput === preset
                          ? 'bg-[#1C1F26] border-white/25 text-[#F4F4F6]'
                          : 'bg-[#0B0C0E] border-white/8 text-[#9496A1] hover:text-[#F4F4F6]'
                      }`}
                    >
                      {preset} ₽
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart Split Feature */}
            <div className="p-4 rounded-lg bg-[#0B0C0E] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[#F4F4F6]">
                  Использовать внутренний баланс и кэшбэк (Smart Split)
                </div>
                <div className="text-xs text-[#9496A1]">
                  Доступно для списания: <span className="font-mono-tabular text-[#F4F4F6] font-semibold">{totalAvailableInternal} ₽</span> ({vaultBalanceRub} ₽ возвратный счет + {cashbackBalanceRub} ₽ кэшбэк)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUseVaultSplit(!useVaultSplit)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  useVaultSplit
                    ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40'
                    : 'bg-[#131519] text-[#9496A1] border border-white/10 hover:text-[#F4F4F6]'
                }`}
              >
                {useVaultSplit ? `Списать -${appliedVaultRub} ₽` : 'Применить баланс'}
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('sbp')}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  paymentMethod === 'sbp'
                    ? 'bg-[#1C1F26] border-[#E11D48] text-[#F4F4F6]'
                    : 'bg-[#0B0C0E] border-white/8 text-[#9496A1] hover:text-[#F4F4F6]'
                }`}
              >
                <div className="text-xs font-semibold">СБП (QR / Банк)</div>
                <div className="text-[11px] text-[#9496A1] mt-0.5">Без комиссии</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('mir')}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  paymentMethod === 'mir'
                    ? 'bg-[#1C1F26] border-[#E11D48] text-[#F4F4F6]'
                    : 'bg-[#0B0C0E] border-white/8 text-[#9496A1] hover:text-[#F4F4F6]'
                }`}
              >
                <div className="text-xs font-semibold">Карта МИР / РФ</div>
                <div className="text-[11px] text-[#9496A1] mt-0.5">Мгновенно</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('vault_only');
                  setUseVaultSplit(true);
                }}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  paymentMethod === 'vault_only'
                    ? 'bg-[#1C1F26] border-[#E11D48] text-[#F4F4F6]'
                    : 'bg-[#0B0C0E] border-white/8 text-[#9496A1] hover:text-[#F4F4F6]'
                }`}
              >
                <div className="text-xs font-semibold">Баланс LevelUp</div>
                <div className="text-[11px] text-[#9496A1] mt-0.5">Оплата в 1 клик</div>
              </button>
            </div>

            <div className="pt-4 border-t border-white/8 space-y-2 text-sm">
              <div className="flex justify-between text-xs text-[#9496A1]">
                <span>Зачислится на кошелек Steam ({activeRegion.currencyCode}):</span>
                <span className="font-mono-tabular text-sm font-semibold text-[#F4F4F6]">
                  ≈ {receiveForeign} {activeRegion.currencySymbol}
                </span>
              </div>
              {appliedVaultRub > 0 && (
                <div className="flex justify-between text-xs text-[#10B981]">
                  <span>Оплачено внутренним балансом и кэшбэком:</span>
                  <span className="font-mono-tabular">−{appliedVaultRub} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#9496A1]">
                <span>Начисление кэшбэка ({loyaltyCashbackPercent}%):</span>
                <span className="font-mono-tabular text-[#10B981]">+{earnedCashbackRub} ₽ на баланс</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#F4F4F6]">К оплате сейчас:</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] text-[#10B981] font-medium">
                    <Lock className="w-3 h-3" />
                    <span>Secure Payment</span>
                  </div>
                </div>
                <span className="text-2xl font-bold font-mono-tabular text-[#F4F4F6]">
                  {finalCardPayRub} ₽
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {justSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Транзакция проведена · Баланс обновлен</span>
                </>
              ) : (
                <>
                  <span>
                    Пополнить {login || 'Steam'} на {receiveForeign} {activeRegion.currencySymbol}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#9496A1] pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                100% возврат на баланс в 1 клик при ошибке в логине
              </span>
              <span className="font-mono-tabular">SSL 256-bit</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
