import React, { useState } from 'react';
import {
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Users,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import {
  LOYALTY_TIERS,
  OrderRecord,
  PriceDropAlert,
  SharedPot,
  RegionRate,
  ReferralFriend,
} from '../data/storeData';
import { UserPlus, Gift, Share2 } from 'lucide-react';
import { SpendingSparkline } from './SpendingSparkline';

interface UserCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'orders' | 'loyalty' | 'pots' | 'alerts' | 'referrals';
  vaultBalanceRub: number;
  cashbackBalanceRub: number;
  totalSpentRub: number;
  orders: OrderRecord[];
  onRefundOrderToVault: (orderId: string) => void;
  onTopUpVaultDirect: (amountRub: number) => void;
  savedAccounts: { label: string; login: string; regionId: RegionRate['id'] }[];
  onAddSavedAccount: (acc: { label: string; login: string; regionId: RegionRate['id'] }) => void;
  onRemoveSavedAccount: (login: string) => void;
  sharedPots: SharedPot[];
  onContributeToPot: (potId: string, amountRub: number, contributorName: string) => void;
  onCreateSharedPot: (title: string, recipient: string, targetRub: number) => void;
  priceAlerts: PriceDropAlert[];
  onRemovePriceAlert: (id: string) => void;
  referrals: ReferralFriend[];
  onSimulateFriendInvite: (friendName: string) => void;
}

export const UserCabinetModal: React.FC<UserCabinetModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
  vaultBalanceRub,
  cashbackBalanceRub,
  totalSpentRub,
  orders,
  onRefundOrderToVault,
  onTopUpVaultDirect,
  savedAccounts,
  onAddSavedAccount,
  onRemoveSavedAccount,
  sharedPots,
  onContributeToPot,
  onCreateSharedPot,
  priceAlerts,
  onRemovePriceAlert,
  referrals,
  onSimulateFriendInvite,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'loyalty' | 'pots' | 'alerts' | 'referrals'>(
    initialTab
  );
  const [newAccLabel, setNewAccLabel] = useState('');
  const [newAccLogin, setNewAccLogin] = useState('');
  const [newAccRegion, setNewAccRegion] = useState<RegionRate['id']>('KZ');

  const [newPotTitle, setNewPotTitle] = useState('');
  const [newPotRecipient, setNewPotRecipient] = useState('');
  const [newPotTarget, setNewPotTarget] = useState<number>(4500);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedReferralLink, setCopiedReferralLink] = useState(false);
  const [friendNameInput, setFriendNameInput] = useState('');
  const [refundSuccessBanner, setRefundSuccessBanner] = useState<string | null>(null);

  const currentTier =
    [...LOYALTY_TIERS].reverse().find((t) => totalSpentRub >= t.minSpentRub) ||
    LOYALTY_TIERS[0];
  const nextTier = LOYALTY_TIERS.find((t) => t.minSpentRub > totalSpentRub);
  const progressPercent = nextTier
    ? Math.min(100, Math.round((totalSpentRub / nextTier.minSpentRub) * 100))
    : 100;

  const handleInstantRefund = (order: OrderRecord) => {
    onRefundOrderToVault(order.id);
    setRefundSuccessBanner(
      `Заказ #${order.id}: ${order.amountPaidRub.toLocaleString('ru-RU')} ₽ мгновенно зачислены на ваш баланс LevelUp.`
    );
    setTimeout(() => setRefundSuccessBanner(null), 5000);
  };

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccLabel.trim() || !newAccLogin.trim()) return;
    onAddSavedAccount({
      label: newAccLabel.trim(),
      login: newAccLogin.trim(),
      regionId: newAccRegion,
    });
    setNewAccLabel('');
    setNewAccLogin('');
  };

  const handleCreatePotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPotTitle.trim() || !newPotRecipient.trim() || newPotTarget < 500) return;
    onCreateSharedPot(newPotTitle.trim(), newPotRecipient.trim(), newPotTarget);
    setNewPotTitle('');
    setNewPotRecipient('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131519] border border-white/12 rounded-xl max-w-5xl w-full overflow-hidden my-8">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-white/8">
          <div>
            <div className="text-xs text-[#9496A1]">
              Личный кабинет · ID: LP-USER-4092 · Статус: {currentTier.name}
            </div>
            <h2 className="text-xl font-bold text-[#F4F4F6] mt-0.5">
              Управление внутренним балансом, возвратами и привилегиями
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1C1F26] text-xs font-semibold text-[#F4F4F6] hover:bg-white/15 transition-colors cursor-pointer"
          >
            Вернуться в магазин
          </button>
        </div>

        <div className="px-6 py-3 bg-[#0B0C0E] border-b border-white/8 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Баланс и Профили' },
            {
              id: 'orders',
              label: `Заказы и 1-Клик Возврат (${orders.filter((o) => o.canRefundToVault).length})`,
            },
            { id: 'loyalty', label: 'Система лояльности' },
            { id: 'referrals', label: `Пригласить друзей (${referrals.length})` },
            { id: 'pots', label: 'Совместные сборы' },
            { id: 'alerts', label: `Радар цен (${priceAlerts.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1C1F26] text-[#F4F4F6] border border-white/15'
                  : 'text-[#9496A1] hover:text-[#F4F4F6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {refundSuccessBanner && (
          <div className="mx-6 mt-5 p-4 rounded-lg bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#10B981] font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{refundSuccessBanner}</span>
            </div>
          </div>
        )}

        <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs text-[#9496A1]">
                      Основной и возвратный баланс
                    </div>
                    <div className="text-3xl font-bold font-mono-tabular text-[#F4F4F6] mt-1">
                      {vaultBalanceRub.toLocaleString('ru-RU')} ₽
                    </div>
                    <p className="text-xs text-[#9496A1] mt-2">
                      Средства от мгновенных возвратов и пополнений. Доступны для оплаты любых покупок.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onTopUpVaultDirect(1000)}
                      className="px-3.5 py-2 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Пополнить +1 000 ₽
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="px-3 py-2 rounded-lg bg-[#131519] border border-white/10 text-xs text-[#9496A1] hover:text-[#F4F4F6] transition-colors cursor-pointer"
                    >
                      Возвраты
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs text-[#9496A1]">
                      Накопленный кэшбэк ({currentTier.cashbackRate}%)
                    </div>
                    <div className="text-3xl font-bold font-mono-tabular text-[#10B981] mt-1">
                      {cashbackBalanceRub.toLocaleString('ru-RU')} ₽
                    </div>
                    <p className="text-xs text-[#9496A1] mt-2">
                      1 бонусный рубль = 1 ₽. Автоматически списывается со Smart Split.
                    </p>
                  </div>
                  <div className="text-xs text-[#9496A1] pt-2 border-t border-white/6">
                    Статус: <span className="text-[#F4F4F6] font-semibold">{currentTier.name}</span> · Скидка комиссии -{currentTier.commissionDiscount}%
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs text-[#9496A1]">
                      Безопасный возврат за 1 клик
                    </div>
                    <div className="text-base font-semibold text-[#F4F4F6] mt-1">
                      Защита от ошибок региона и UID
                    </div>
                    <p className="text-xs text-[#9496A1] mt-2">
                      Возврат зачисляется моментально на баланс аккаунта LevelUp.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="w-full py-2 px-3 rounded-lg bg-[#1C1F26] hover:bg-white/15 text-xs font-semibold text-[#F4F4F6] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#10B981]" />
                    Список операций для возврата
                  </button>
                </div>
              </div>

              {/* Mini Sparkline Chart for 30-Day Spending Trends */}
              <SpendingSparkline totalSpentRub={totalSpentRub} />

              {/* Profiles */}
              <div className="pt-4 border-t border-white/8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-base font-semibold text-[#F4F4F6]">
                    Сохраненные профили
                  </h3>
                  <div className="space-y-2.5">
                    {savedAccounts.map((acc) => (
                      <div
                        key={acc.login}
                        className="p-3.5 rounded-lg bg-[#0B0C0E] border border-white/8 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#F4F4F6]">
                            {acc.label}
                          </div>
                          <div className="text-xs text-[#9496A1] font-mono-tabular">
                            Логин / ID: {acc.login} · Регион: {acc.regionId}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveSavedAccount(acc.login)}
                          className="p-2 text-[#9496A1] hover:text-[#EF4444] transition-colors cursor-pointer"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={handleAddAccountSubmit}
                  className="lg:col-span-5 p-5 rounded-xl bg-[#0B0C0E] border border-white/8 space-y-4"
                >
                  <h4 className="text-sm font-semibold text-[#F4F4F6]">
                    Добавить игровой аккаунт
                  </h4>
                  <div>
                    <label className="block text-xs text-[#9496A1] mb-1">
                      Название шаблона
                    </label>
                    <input
                      type="text"
                      value={newAccLabel}
                      onChange={(e) => setNewAccLabel(e.target.value)}
                      placeholder="Основа Steam"
                      className="w-full bg-[#131519] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F4F4F6]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-xs text-[#9496A1] mb-1">
                        Логин Steam или UID
                      </label>
                      <input
                        type="text"
                        value={newAccLogin}
                        onChange={(e) => setNewAccLogin(e.target.value)}
                        placeholder="user_login_99"
                        className="w-full bg-[#131519] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F4F4F6] font-mono-tabular"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9496A1] mb-1">Регион</label>
                      <select
                        value={newAccRegion}
                        onChange={(e) => setNewAccRegion(e.target.value as RegionRate['id'])}
                        className="w-full bg-[#131519] border border-white/10 rounded-lg px-2 py-2 text-xs text-[#F4F4F6]"
                      >
                        <option value="KZ">KZ (₸)</option>
                        <option value="RU">RU (₽)</option>
                        <option value="TR">TR ($)</option>
                        <option value="UA">UA (₴)</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#1C1F26] hover:bg-white/15 text-xs font-semibold text-[#F4F4F6] transition-colors cursor-pointer"
                  >
                    Сохранить профиль
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-semibold text-[#F4F4F6]">
                  История операций и 1-Клик Возврат
                </h3>
                <p className="text-xs text-[#9496A1]">
                  Если код не подошел или возникла ошибка, верните 100% суммы на внутренний баланс.
                </p>
              </div>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#9496A1]">
                        <span className="font-mono-tabular text-[#F4F4F6] font-semibold">
                          #{order.id}
                        </span>
                        <span>·</span>
                        <span>{order.date}</span>
                        <span>·</span>
                        <span>{order.platform} ({order.region})</span>
                        <span>·</span>
                        <span>Получатель: {order.targetAccount}</span>
                      </div>

                      <div className="text-base font-semibold text-[#F4F4F6]">
                        {order.title}
                      </div>

                      {order.refundReason && order.canRefundToVault && (
                        <div className="text-xs text-[#F59E0B] flex items-center gap-1.5 pt-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{order.refundReason}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/6">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono-tabular text-[#F4F4F6]">
                          {order.amountPaidRub.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-[11px] text-[#10B981] font-mono-tabular">
                          +{order.cashbackEarned} ₽ кэшбэк
                        </div>
                      </div>

                      {order.status === 'refunded_to_vault' ? (
                        <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Возвращено на баланс
                        </span>
                      ) : order.canRefundToVault ? (
                        <button
                          type="button"
                          onClick={() => handleInstantRefund(order)}
                          className="px-4 py-2.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Вернуть {order.amountPaidRub} ₽ на баланс</span>
                        </button>
                      ) : (
                        <span className="text-xs text-[#9496A1] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                          Доставлено
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div className="space-y-8">
              <div className="p-6 rounded-xl bg-[#0B0C0E] border border-white/8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#9496A1]">Текущий уровень</div>
                    <div className="text-2xl font-bold text-[#F4F4F6] mt-0.5">
                      {currentTier.name} — {currentTier.cashbackRate}% Кэшбэк
                    </div>
                  </div>
                  <div className="text-right font-mono-tabular">
                    <div className="text-xs text-[#9496A1]">Общий оборот</div>
                    <div className="text-xl font-bold text-[#F4F4F6]">
                      {totalSpentRub.toLocaleString('ru-RU')} ₽
                      {nextTier && ` / ${nextTier.minSpentRub.toLocaleString('ru-RU')} ₽`}
                    </div>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-[#131519] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="text-xs text-[#9496A1]">
                  {nextTier
                    ? `До уровня ${nextTier.name} осталось ${(nextTier.minSpentRub - totalSpentRub).toLocaleString('ru-RU')} ₽.`
                    : 'Вы достигли максимального уровня!'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LOYALTY_TIERS.map((tier) => {
                  const isCurrent = tier.id === currentTier.id;
                  return (
                    <div
                      key={tier.id}
                      className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
                        isCurrent
                          ? 'bg-[#1C1F26]/60 border-[#10B981]'
                          : 'bg-[#0B0C0E] border-white/8'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#9496A1]">
                          <span>От {tier.minSpentRub.toLocaleString('ru-RU')} ₽</span>
                          {isCurrent && (
                            <span className="text-[#10B981] font-semibold">Ваш уровень</span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-[#F4F4F6]">{tier.name}</h4>
                        <div className="text-2xl font-bold font-mono-tabular text-[#10B981]">
                          {tier.cashbackRate}% кэшбэк
                        </div>
                        <p className="text-xs text-[#9496A1] leading-relaxed">{tier.perks}</p>
                      </div>
                      <div className="pt-3 border-t border-white/6 text-xs text-[#9496A1] font-mono-tabular">
                        Скидка на комиссию: −{tier.commissionDiscount}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'pots' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-[#F4F4F6]">
                    Совместные сборы на подарки
                  </h3>
                  <p className="text-xs text-[#9496A1] mt-0.5">
                    Скидывайтесь с друзьями на игры и подписки прямо в приложении.
                  </p>
                </div>

                {sharedPots.map((pot) => {
                  const pct = Math.min(100, Math.round((pot.currentAmountRub / pot.targetAmountRub) * 100));
                  return (
                    <div
                      key={pot.id}
                      className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs text-[#9496A1]">
                            Получатель: <span className="text-[#F4F4F6]">{pot.recipientName}</span> · Код: <span className="font-mono-tabular">{pot.shareCode}</span>
                          </div>
                          <h4 className="text-base font-bold text-[#F4F4F6] mt-0.5">
                            {pot.goalTitle}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCopiedCode(pot.shareCode);
                            setTimeout(() => setCopiedCode(null), 2000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#131519] border border-white/10 text-xs text-[#9496A1] hover:text-[#F4F4F6] flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedCode === pot.shareCode ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#10B981]" /> Скопировано
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Поделиться
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono-tabular">
                          <span className="text-[#10B981] font-semibold">
                            Собрано: {pot.currentAmountRub.toLocaleString('ru-RU')} ₽ ({pct}%)
                          </span>
                          <span className="text-[#9496A1]">
                            Цель: {pot.targetAmountRub.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#131519] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#E11D48] transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/6">
                        <div className="text-xs text-[#9496A1]">
                          Участники ({pot.contributors.length}):{' '}
                          {pot.contributors.map((c) => `${c.name} (${c.amountRub} ₽)`).join(' · ')}
                        </div>
                        {pot.currentAmountRub < pot.targetAmountRub && (
                          <button
                            type="button"
                            onClick={() => onContributeToPot(pot.id, 500, 'Вы')}
                            className="px-3.5 py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Внести +500 ₽
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={handleCreatePotSubmit}
                className="lg:col-span-5 p-5 rounded-xl bg-[#0B0C0E] border border-white/8 space-y-4 h-fit"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[#F4F4F6]">
                  <Users className="w-4 h-4 text-[#E11D48]" />
                  <span>Создать новый сбор на подарок</span>
                </div>
                <div>
                  <label className="block text-xs text-[#9496A1] mb-1">
                    На что собираем
                  </label>
                  <input
                    type="text"
                    value={newPotTitle}
                    onChange={(e) => setNewPotTitle(e.target.value)}
                    placeholder="Например: GTA VI / PS Plus"
                    className="w-full bg-[#131519] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F4F4F6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9496A1] mb-1">
                    Получатель подарка
                  </label>
                  <input
                    type="text"
                    value={newPotRecipient}
                    onChange={(e) => setNewPotRecipient(e.target.value)}
                    placeholder="Максим (@max)"
                    className="w-full bg-[#131519] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F4F4F6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9496A1] mb-1">
                    Целевая сумма (₽)
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    value={newPotTarget}
                    onChange={(e) => setNewPotTarget(Number(e.target.value))}
                    className="w-full bg-[#131519] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F4F4F6] font-mono-tabular"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#1C1F26] hover:bg-white/15 text-xs font-semibold text-[#F4F4F6] transition-colors cursor-pointer"
                >
                  Открыть сбор
                </button>
              </form>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-[#F4F4F6]">
                  Радар цен и акций
                </h3>
                <p className="text-xs text-[#9496A1] mt-0.5">
                  Уведомления о снижении стоимости подписок или курсов валют.
                </p>
              </div>

              {priceAlerts.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#0B0C0E] border border-white/8 text-center text-xs text-[#9496A1]">
                  Нет активных отслеживаний.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {priceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-xl bg-[#0B0C0E] border border-white/8 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-[#F4F4F6]">
                          {alert.productTitle}
                        </div>
                        <div className="text-xs text-[#9496A1] font-mono-tabular">
                          Текущая: {alert.currentPriceRub} ₽ · Цель:{' '}
                          <span className="text-[#10B981]">{alert.targetPriceRub} ₽</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemovePriceAlert(alert.id)}
                        className="p-2 text-[#9496A1] hover:text-[#EF4444] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="space-y-8">
              {/* Top Highlight Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-[#9496A1]">
                      Бонус за каждого друга
                    </div>
                    <div className="text-2xl font-bold font-mono-tabular text-[#10B981] mt-1">
                      +200 ₽ кэшбэк
                    </div>
                    <p className="text-xs text-[#9496A1] mt-1.5 leading-relaxed">
                      Начисляется сразу, как только приглашенный друг завершит свой первый платеж в магазине.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#9496A1] pt-2 border-t border-white/6 font-mono-tabular">
                    Друг также получает: <span className="text-[#F4F4F6] font-semibold">0% комиссии на 1-й заказ</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-[#9496A1]">
                      Всего заработано на рефералах
                    </div>
                    <div className="text-2xl font-bold font-mono-tabular text-[#F4F4F6] mt-1">
                      {referrals
                        .reduce((sum, r) => sum + r.rewardEarnedRub, 0)
                        .toLocaleString('ru-RU')} ₽
                    </div>
                    <p className="text-xs text-[#9496A1] mt-1.5 leading-relaxed">
                      Бонусные рубли сразу поступают на ваш баланс кэшбэка и списываются через Smart Split.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#10B981] pt-2 border-t border-white/6 font-mono-tabular">
                    Приглашено друзей: {referrals.length}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-[#9496A1]">
                      Пожизненный кэшбэк
                    </div>
                    <div className="text-2xl font-bold font-mono-tabular text-[#F59E0B] mt-1">
                      +1.0% от покупок
                    </div>
                    <p className="text-xs text-[#9496A1] mt-1.5 leading-relaxed">
                      Дополнительно получайте 1% от всех будущих пополнений приглашенных игроков.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#9496A1] pt-2 border-t border-white/6">
                    Автоматический перевод на баланс
                  </div>
                </div>
              </div>

              {/* Referral Link Generator & Simulation Bar */}
              <div className="p-6 rounded-xl bg-[#0B0C0E] border border-white/8 space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-[#F4F4F6]">
                    Ваша персональная реферальная ссылка
                  </h3>
                  <p className="text-xs text-[#9496A1] mt-0.5">
                    Отправьте ссылку другу в Discord, Telegram или VK. После перехода промокод активируется автоматически.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 bg-[#131519] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F4F4F6] font-mono-tabular select-all truncate">
                    https://levelup-payments.app/ref/LP-USER-4092
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText?.(
                        'https://levelup-payments.app/ref/LP-USER-4092'
                      );
                      setCopiedReferralLink(true);
                      setTimeout(() => setCopiedReferralLink(false), 2500);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    {copiedReferralLink ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Ссылка скопирована!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Скопировать ссылку</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Simulator: Test Referral Flow */}
                <div className="pt-4 border-t border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#F4F4F6]">
                      Протестировать приглашение друга в демо-режиме:
                    </div>
                    <div className="text-[11px] text-[#9496A1]">
                      Имитирует регистрацию и первый платеж друга с зачислением вам +200 ₽ кэшбэка
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={friendNameInput}
                      onChange={(e) => setFriendNameInput(e.target.value)}
                      placeholder="Имя друга (напр. @vladimir)"
                      className="bg-[#131519] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#F4F4F6] w-48"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const targetName = friendNameInput.trim() || `Друг #${referrals.length + 1}`;
                        onSimulateFriendInvite(targetName);
                        setFriendNameInput('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1C1F26] hover:bg-white/15 text-xs font-semibold text-[#10B981] border border-[#10B981]/30 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Пригласить</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Referred Friends History Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-[#F4F4F6]">
                      Приглашенные игроки
                    </h3>
                    <p className="text-xs text-[#9496A1]">
                      Статусы активации и начисленные награды за регистрацию и пополнения.
                    </p>
                  </div>
                </div>

                {referrals.length === 0 ? (
                  <div className="p-8 rounded-xl bg-[#0B0C0E] border border-white/8 text-center text-xs text-[#9496A1]">
                    У вас пока нет приглашенных друзей. Скопируйте ссылку выше и отправьте друзьям!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {referrals.map((friend) => (
                      <div
                        key={friend.id}
                        className="p-4 rounded-xl bg-[#0B0C0E] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-[#F4F4F6] flex items-center gap-2">
                            <span>{friend.name}</span>
                            <span className="text-[11px] text-[#9496A1] font-mono-tabular">
                              · {friend.date}
                            </span>
                          </div>
                          <div className="text-xs text-[#9496A1]">
                            {friend.status === 'completed_first_topup' ? (
                              <span className="text-[#10B981] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Первый заказ завершен (пополнение на {friend.firstTopUpAmountRub} ₽)
                              </span>
                            ) : (
                              <span>Зарегистрировался по ссылке, ожидает первый платеж</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <div className="text-xs text-[#9496A1]">Ваш бонус</div>
                            <div className="text-sm font-bold font-mono-tabular text-[#10B981]">
                              +{friend.rewardEarnedRub} ₽
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
