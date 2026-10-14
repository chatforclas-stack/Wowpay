import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { CatalogProduct } from '../data/storeData';

interface ProductCheckoutModalProps {
  product: CatalogProduct | null;
  onClose: () => void;
  vaultBalanceRub: number;
  cashbackBalanceRub: number;
  onCompleteOrder: (payload: {
    product: CatalogProduct;
    variantLabel: string;
    targetAccount: string;
    totalPayRub: number;
    usedVaultRub: number;
    earnedCashbackRub: number;
  }) => void;
}

export const ProductCheckoutModal: React.FC<ProductCheckoutModalProps> = ({
  product,
  onClose,
  vaultBalanceRub,
  cashbackBalanceRub,
  onCompleteOrder,
}) => {
  if (!product) return null;

  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [targetAccount, setTargetAccount] = useState('');
  const [useVaultSplit, setUseVaultSplit] = useState(true);
  const [isGiftPotMode, setIsGiftPotMode] = useState(false);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const totalInternalAvailable = vaultBalanceRub + cashbackBalanceRub;
  const appliedVaultRub = useVaultSplit
    ? Math.min(selectedVariant.priceRub, totalInternalAvailable)
    : 0;
  const finalPayRub = Math.max(0, selectedVariant.priceRub - appliedVaultRub);
  const earnedCashbackRub = Math.round(
    (selectedVariant.priceRub * product.cashbackPercent) / 100
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccount.trim()) return;

    onCompleteOrder({
      product,
      variantLabel: selectedVariant.label,
      targetAccount: targetAccount.trim(),
      totalPayRub: finalPayRub,
      usedVaultRub: appliedVaultRub,
      earnedCashbackRub,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131519] border border-white/12 rounded-xl max-w-2xl w-full overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="text-xs text-[#9496A1]">
            {product.platform} · {product.region}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9496A1] hover:text-[#F4F4F6] hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            <div className="sm:col-span-5 aspect-4/3 rounded-lg overflow-hidden bg-[#18181B] border border-white/8">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-7 space-y-2">
              <h3 className="text-xl font-bold text-[#F4F4F6] leading-snug">
                {product.title}
              </h3>
              <p className="text-xs text-[#9496A1] leading-relaxed">
                {product.description}
              </p>
              <div className="text-xs text-[#10B981] pt-1">
                {product.deliveryType} · Кэшбэк +{product.cashbackPercent}%
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#9496A1] mb-2">
              Выберите номинал или период подписки
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    selectedVariantId === variant.id
                      ? 'bg-[#1C1F26] border-[#E11D48] text-[#F4F4F6]'
                      : 'bg-[#0B0C0E] border-white/8 text-[#9496A1] hover:text-[#F4F4F6]'
                  }`}
                >
                  <div className="text-xs font-semibold">{variant.label}</div>
                  <div className="text-sm font-mono-tabular font-bold text-[#F4F4F6] mt-1">
                    {variant.priceRub.toLocaleString('ru-RU')} ₽
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-[#9496A1] mb-2">
              <span>{product.requiresAccountField}</span>
              <button
                type="button"
                onClick={() => setIsGiftPotMode(!isGiftPotMode)}
                className="text-xs text-[#10B981] hover:underline cursor-pointer"
              >
                {isGiftPotMode ? 'Оформить для себя' : 'Оформить в подарок другу'}
              </button>
            </div>
            <input
              type="text"
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
              placeholder={product.accountPlaceholder}
              required
              className="w-full bg-[#0B0C0E] border border-white/12 rounded-lg px-3.5 py-2.5 text-sm text-[#F4F4F6] placeholder-[#9496A1]/50 focus:outline-none focus:border-[#E11D48] font-mono-tabular"
            />
          </div>

          <div className="p-4 rounded-lg bg-[#0B0C0E] border border-white/8 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#F4F4F6]">
                Списать внутренний баланс и кэшбэк LevelUp
              </div>
              <div className="text-xs text-[#9496A1] mt-0.5">
                Доступно: <span className="font-mono-tabular text-[#F4F4F6]">{totalInternalAvailable} ₽</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUseVaultSplit(!useVaultSplit)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                useVaultSplit
                  ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40'
                  : 'bg-[#131519] text-[#9496A1] border border-white/10'
              }`}
            >
              {useVaultSplit ? `−${appliedVaultRub} ₽ применено` : 'Использовать'}
            </button>
          </div>

          <div className="pt-4 border-t border-white/8 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#9496A1]">
              <span>Начислим кэшбэк:</span>
              <span className="font-mono-tabular text-[#10B981]">+{earnedCashbackRub} ₽</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#F4F4F6]">Итого к оплате:</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] text-[#10B981] font-medium">
                  <Lock className="w-3 h-3" />
                  <span>Secure Payment</span>
                </div>
              </div>
              <span className="text-2xl font-bold font-mono-tabular text-[#F4F4F6]">
                {finalPayRub.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-lg bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Оплатить ({selectedVariant.label})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#9496A1]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                100% возврат на баланс в 1 клик при неактивированном коде
              </span>
              <span className="flex items-center gap-1 text-[#10B981]">
                <CheckCircle2 className="w-3 h-3" /> В наличии
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
