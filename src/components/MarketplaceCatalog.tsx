import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpRight, BellRing, Check } from 'lucide-react';
import { CATALOG_PRODUCTS, CatalogProduct } from '../data/storeData';

interface MarketplaceCatalogProps {
  onSelectProduct: (product: CatalogProduct) => void;
  onAddPriceAlert: (product: CatalogProduct) => void;
  alertedProductIds: string[];
}

export const MarketplaceCatalog: React.FC<MarketplaceCatalogProps> = ({
  onSelectProduct,
  onAddPriceAlert,
  alertedProductIds,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | CatalogProduct['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: 'all' | CatalogProduct['category']; label: string }[] = [
    { id: 'all', label: 'Все платформы' },
    { id: 'mobile', label: 'Мобильные & Gacha (Genshin / HSR / ZZZ / PUBG / MLBB)' },
    { id: 'donate', label: 'Внутриигровой донат' },
    { id: 'subscriptions', label: 'Подписки (PSN / Xbox)' },
    { id: 'vouchers', label: 'Подарочные карты' },
  ];

  const filteredProducts = CATALOG_PRODUCTS.filter((item) => {
    // When 'mobile' filter is active, include products categorized as 'mobile' OR gacha games (genshin, hsr, zzz)
    const matchesCategory =
      activeCategory === 'all' ||
      item.category === activeCategory ||
      (activeCategory === 'mobile' &&
        (item.id.includes('genshin') ||
          item.id.includes('hsr') ||
          item.id.includes('zzz') ||
          item.category === 'mobile'));
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog-section" className="max-w-[1280px] mx-auto px-6 py-14 border-t border-white/8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-xs text-[#9496A1] mb-1">
            Цифровой каталог · Мгновенная выдача кодов и прямой донат по UID
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F6] tracking-tight">
            Пополнение платформ, подписок и игровой валюты
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9496A1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="PlayStation, Genshin, Valorant..."
              className="w-full sm:w-64 bg-[#131519] border border-white/10 rounded-lg pl-9 pr-3.5 py-2 text-xs text-[#F4F4F6] placeholder-[#9496A1]/60 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#131519] border border-white/8 rounded-lg overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#1C1F26] text-[#F4F4F6] shadow-xs'
                    : 'text-[#9496A1] hover:text-[#F4F4F6]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#131519] border border-white/8 text-center space-y-3">
          <SlidersHorizontal className="w-6 h-6 text-[#9496A1] mx-auto" />
          <div className="text-base font-semibold text-[#F4F4F6]">Ничего не найдено</div>
          <p className="text-xs text-[#9496A1]">Попробуйте сбросить фильтр или изменить поисковый запрос.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold bg-[#1C1F26] text-[#F4F4F6] rounded-lg hover:bg-white/15 transition-colors cursor-pointer"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((product) => {
            const isAlerted = alertedProductIds.includes(product.id);
            const cashbackRub = Math.round((product.priceRub * product.cashbackPercent) / 100);

            return (
              <div
                key={product.id}
                className="group bg-[#131519] border border-white/8 rounded-xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:border-white/20"
              >
                <div>
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-4/3 bg-[#18181B] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131519] via-transparent to-transparent opacity-65" />
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#9496A1]">
                      <span>
                        {product.platform} · {product.region}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-base font-semibold text-[#F4F4F6] group-hover:text-white cursor-pointer leading-snug"
                    >
                      {product.title}
                    </h3>

                    <div className="text-xs text-[#9496A1]">
                      {product.deliveryType} · <span className="text-[#10B981]">+{cashbackRub} ₽ кэшбэк ({product.cashbackPercent}%)</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-white/6 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-[#9496A1]">От номинала</div>
                    <div className="text-[16px] font-semibold font-mono-tabular text-[#F4F4F6]">
                      {product.priceRub.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddPriceAlert(product)}
                      title="Уведомить при снижении цены"
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isAlerted
                          ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                          : 'bg-[#0B0C0E] border-white/8 text-[#9496A1] hover:text-[#F4F4F6]'
                      }`}
                    >
                      {isAlerted ? <Check className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="px-4 py-2 rounded-lg bg-[#1C1F26] hover:bg-[#E11D48] text-[#F4F4F6] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <span>Выбрать</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
