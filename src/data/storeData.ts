import heroImg from '../assets/images/hero_gaming_setup_1791439211978.jpg';
import psPlusImg from '../assets/images/product_ps_plus_1791439222127.jpg';
import steamCardImg from '../assets/images/product_steam_card_1791439231739.jpg';
import genshinImg from '../assets/images/product_crystals_1791439241973.jpg';
import xboxImg from '../assets/images/product_xbox_pass_1791439252449.jpg';
import pubgImg from '../assets/images/product_pubg_mobile_uc_1791443053658.jpg';
import mlbbImg from '../assets/images/product_mlbb_diamonds_1791443069017.jpg';
import hsrImg from '../assets/images/product_hsr_oneiric_1791443310119.jpg';
import zzzImg from '../assets/images/product_zzz_monochromes_1791443323309.jpg';

export type PlatformId = 'steam' | 'psn' | 'epic' | 'xbox' | 'genshin' | 'valorant' | 'pubg' | 'mlbb' | 'hsr' | 'zzz';

export interface RegionRate {
  id: 'RU' | 'KZ' | 'TR' | 'UA' | 'US';
  name: string;
  currencySymbol: string;
  currencyCode: string;
  rateToRub: number;
  commissionBase: number;
  note: string;
}

export interface CatalogProduct {
  id: string;
  title: string;
  platform: string;
  category: 'subscriptions' | 'vouchers' | 'donate' | 'mobile' | 'keys';
  region: string;
  deliveryType: string;
  priceRub: number;
  cashbackPercent: number;
  image: string;
  description: string;
  variants: {
    id: string;
    label: string;
    priceRub: number;
  }[];
  requiresAccountField: string;
  accountPlaceholder: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  title: string;
  platform: string;
  targetAccount: string;
  region: string;
  amountPaidRub: number;
  usedVaultRub: number;
  cashbackEarned: number;
  status: 'completed' | 'processing' | 'failed_network' | 'refunded_to_vault';
  canRefundToVault: boolean;
  refundReason?: string;
}

export interface PriceDropAlert {
  id: string;
  productTitle: string;
  targetPriceRub: number;
  currentPriceRub: number;
  notifyTelegram: boolean;
  active: boolean;
}

export interface SharedPot {
  id: string;
  recipientName: string;
  goalTitle: string;
  targetAmountRub: number;
  currentAmountRub: number;
  contributors: { name: string; amountRub: number; date: string }[];
  shareCode: string;
}

export interface ReferralFriend {
  id: string;
  name: string;
  date: string;
  status: 'registered' | 'completed_first_topup';
  firstTopUpAmountRub?: number;
  rewardEarnedRub: number;
}

export const HERO_IMAGE = heroImg;

export const STEAM_REGIONS: RegionRate[] = [
  {
    id: 'RU',
    name: 'Россия (RUB)',
    currencySymbol: '₽',
    currencyCode: 'RUB',
    rateToRub: 1,
    commissionBase: 5.9,
    note: 'Прямое зачисление по логину за 15 секунд'
  },
  {
    id: 'KZ',
    name: 'Казахстан (KZT)',
    currencySymbol: '₸',
    currencyCode: 'KZT',
    rateToRub: 0.21,
    commissionBase: 4.5,
    note: 'Рекомендуемый регион без ограничений издателей'
  },
  {
    id: 'TR',
    name: 'Турция (USD-MENA)',
    currencySymbol: '$',
    currencyCode: 'USD',
    rateToRub: 96.4,
    commissionBase: 6.2,
    note: 'Конвертация по биржевому курсу MENA-USD'
  },
  {
    id: 'UA',
    name: 'Украина (UAH)',
    currencySymbol: '₴',
    currencyCode: 'UAH',
    rateToRub: 2.38,
    commissionBase: 5.5,
    note: 'Автоматический пересчет в гривны при зачислении'
  }
];

export const LOYALTY_TIERS = [
  {
    id: 'bronze',
    name: 'Standard Tier',
    minSpentRub: 0,
    cashbackRate: 2.0,
    commissionDiscount: 0,
    perks: 'Базовый кэшбэк 2% и мгновенный возврат в баланс при сбое'
  },
  {
    id: 'silver',
    name: 'Vanguard Tier',
    minSpentRub: 5000,
    cashbackRate: 4.5,
    commissionDiscount: 1.5,
    perks: 'Кэшбэк 4.5%, снижение комиссии Steam на 1.5%, приоритетный шлюз'
  },
  {
    id: 'obsidian',
    name: 'Obsidian Tier',
    minSpentRub: 15000,
    cashbackRate: 7.0,
    commissionDiscount: 3.0,
    perks: 'Максимальный кэшбэк 7%, комиссия Steam от 2.9%, 0% на сплит-возвраты'
  }
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'ps-plus-deluxe',
    title: 'PlayStation Plus Deluxe — 12 Месяцев',
    platform: 'PlayStation Store',
    category: 'subscriptions',
    region: 'Турция / Украина / Индия',
    deliveryType: 'Активация на аккаунт · 5 мин',
    priceRub: 4890,
    cashbackPercent: 5,
    image: psPlusImg,
    description: 'Полный каталог из 400+ хитов PS4 и PS5, классический каталог, облачный стриминг и эксклюзивные пробные версии новинок без ограничений.',
    variants: [
      { id: 'ps-essential-12', label: 'Essential · 12 мес', priceRub: 3190 },
      { id: 'ps-extra-12', label: 'Extra · 12 мес', priceRub: 4190 },
      { id: 'ps-deluxe-12', label: 'Deluxe · 12 мес', priceRub: 4890 }
    ],
    requiresAccountField: 'Email от PSN аккаунта или резервный код',
    accountPlaceholder: 'gamer@example.com'
  },
  {
    id: 'steam-gift-voucher',
    title: 'Подарочная карта Steam Wallet Global',
    platform: 'Steam',
    category: 'vouchers',
    region: 'Global / KZ / US / EU',
    deliveryType: 'Цифровой код · Мгновенно',
    priceRub: 1950,
    cashbackPercent: 4,
    image: steamCardImg,
    description: 'Официальный цифровой ваучер пополнения кошелька Steam. Идеально подходит для подарка другу или пополнения без указания логина.',
    variants: [
      { id: 'st-10', label: '10 USD Карта', priceRub: 980 },
      { id: 'st-20', label: '20 USD Карта', priceRub: 1950 },
      { id: 'st-50', label: '50 USD Карта', priceRub: 4820 }
    ],
    requiresAccountField: 'Email для доставки цифрового ключа',
    accountPlaceholder: 'you@domain.ru'
  },
  {
    id: 'genshin-crystals-6480',
    title: 'Кристаллы Сотворения + Благословение Луны',
    platform: 'HoYoverse',
    category: 'donate',
    region: 'Все серверы (Europe / Asia / America)',
    deliveryType: 'По UID · Без входа в аккаунт',
    priceRub: 1490,
    cashbackPercent: 6,
    image: genshinImg,
    description: 'Безопасное пополнение кристаллов напрямую по игровому UID через официального партнера. Бонус первого пополнения сохраняется.',
    variants: [
      { id: 'gi-moon', label: 'Благословение Полой Луны', priceRub: 390 },
      { id: 'gi-980', label: '980 + 110 Кристаллов', priceRub: 1490 },
      { id: 'gi-6480', label: '6480 + 1600 Кристаллов', priceRub: 7890 }
    ],
    requiresAccountField: 'Ваш игровой UID (9 цифр)',
    accountPlaceholder: '704829104'
  },
  {
    id: 'xbox-gamepass-ultimate',
    title: 'Xbox Game Pass Ultimate (PC + Console)',
    platform: 'Xbox / Microsoft',
    category: 'subscriptions',
    region: 'Global / Мультирегион',
    deliveryType: '25-значный код · Мгновенно',
    priceRub: 2690,
    cashbackPercent: 5,
    image: xboxImg,
    description: 'Единая подписка на сотни игр для ПК и консолей Xbox Series X|S, включая релизы первого дня (Call of Duty, STALKER 2, Forza) и EA Play.',
    variants: [
      { id: 'xb-3m', label: '3 Месяца Ultimate', priceRub: 2690 },
      { id: 'xb-6m', label: '6 Месяцев Ultimate', priceRub: 4990 },
      { id: 'xb-12m', label: '12 Месяцев Ultimate', priceRub: 8990 }
    ],
    requiresAccountField: 'Email для получения ключа и инструкции',
    accountPlaceholder: 'xbox-player@mail.ru'
  },
  {
    id: 'epic-fortnite-vbucks',
    title: 'Epic Games · Набор В-Баксов и Боевой Пропуск',
    platform: 'Epic Games',
    category: 'donate',
    region: 'Любой регион (TR / KZ / Global)',
    deliveryType: 'Официальный подарок / Код · 3 мин',
    priceRub: 1790,
    cashbackPercent: 5,
    image: psPlusImg,
    description: 'Быстрое зачисление игровой валюты Fortnite и активация эксклюзивных наборов Epic Games Store с начислением повышенного кэшбэка.',
    variants: [
      { id: 'vb-1000', label: '1 000 V-Bucks', priceRub: 750 },
      { id: 'vb-2800', label: '2 800 V-Bucks', priceRub: 1790 },
      { id: 'vb-5000', label: '5 000 V-Bucks', priceRub: 2890 }
    ],
    requiresAccountField: 'Никнейм Epic Games ID',
    accountPlaceholder: 'NightStalker_99'
  },
  {
    id: 'valorant-points-ru-tr',
    title: 'Riot Games · Valorant Points (VP)',
    platform: 'Riot Games',
    category: 'vouchers',
    region: 'EU / TR / CIS',
    deliveryType: 'Код погашения Riot · 10 сек',
    priceRub: 2150,
    cashbackPercent: 4,
    image: steamCardImg,
    description: 'Мгновенные коды пополнения Valorant Points и League of Legends RP. Активируются прямо в клиенте игры во вкладке магазина.',
    variants: [
      { id: 'vp-1000', label: '1 000 VP', priceRub: 990 },
      { id: 'vp-2050', label: '2 050 VP', priceRub: 2150 },
      { id: 'vp-5350', label: '5 350 VP', priceRub: 4950 }
    ],
    requiresAccountField: 'Riot ID (для проверки региона кода)',
    accountPlaceholder: 'Viper#EUW'
  },
  {
    id: 'pubg-mobile-uc',
    title: 'PUBG Mobile · Unknown Cash (UC)',
    platform: 'PUBG Mobile',
    category: 'mobile',
    region: 'Global / Все регионы',
    deliveryType: 'По Player ID · Мгновенно 15 сек',
    priceRub: 790,
    cashbackPercent: 6,
    image: pubgImg,
    description: 'Прямое зачисление игровой валюты UC в PUBG Mobile по цифровому Player ID игрока. Безопасно, без передачи пароля от аккаунта, подходит для Royale Pass.',
    variants: [
      { id: 'uc-60', label: '60 UC', priceRub: 120 },
      { id: 'uc-325', label: '300 + 25 UC (Royale Pass)', priceRub: 590 },
      { id: 'uc-660', label: '600 + 60 UC', priceRub: 1190 },
      { id: 'uc-1800', label: '1500 + 300 UC', priceRub: 2990 },
      { id: 'uc-3850', label: '3000 + 850 UC', priceRub: 5890 }
    ],
    requiresAccountField: 'Ваш цифровой Player ID в игре (8-11 цифр)',
    accountPlaceholder: '5192847103'
  },
  {
    id: 'mlbb-diamonds',
    title: 'Mobile Legends: Bang Bang · Алмазы (Diamonds)',
    platform: 'Mobile Legends',
    category: 'mobile',
    region: 'RU / CIS / Global',
    deliveryType: 'По User ID + Zone ID · 10 сек',
    priceRub: 490,
    cashbackPercent: 6,
    image: mlbbImg,
    description: 'Официальное пополнение алмазов MLBB и активация Алмазного Пропуска Сумерек (Twilight Pass) напрямую по User ID и Zone ID без входа в аккаунт.',
    variants: [
      { id: 'ml-weekly', label: 'Недельный Пропуск Алмазов', priceRub: 220 },
      { id: 'ml-296', label: '257 + 39 Алмазов', priceRub: 490 },
      { id: 'ml-592', label: '514 + 78 Алмазов', priceRub: 980 },
      { id: 'ml-1184', label: '1028 + 156 Алмазов', priceRub: 1950 },
      { id: 'ml-2412', label: '2056 + 356 Алмазов', priceRub: 3890 }
    ],
    requiresAccountField: 'User ID и Zone ID (напр. 12345678 (1234))',
    accountPlaceholder: '542019482 (6210)'
  },
  {
    id: 'hsr-oneiric-shards',
    title: 'Honkai: Star Rail · Сущности снов + Пропуск',
    platform: 'Honkai: Star Rail',
    category: 'donate',
    region: 'Все серверы (Europe / Asia / America)',
    deliveryType: 'По UID · Моментально 15 сек',
    priceRub: 1490,
    cashbackPercent: 6,
    image: hsrImg,
    description: 'Официальное пополнение Сущностей снов (Oneiric Shards) и Пропуска снабжения экспресса напрямую по вашему игровому UID. Бонус первого пополнения (х2) сохраняется.',
    variants: [
      { id: 'hsr-pass', label: 'Пропуск снабжения экспресса (30 дн)', priceRub: 390 },
      { id: 'hsr-980', label: '980 + 110 Сущностей снов', priceRub: 1490 },
      { id: 'hsr-1980', label: '1980 + 260 Сущностей снов', priceRub: 2990 },
      { id: 'hsr-6480', label: '6480 + 1600 Сущностей снов', priceRub: 7890 }
    ],
    requiresAccountField: 'Ваш игровой UID в Star Rail (9 цифр)',
    accountPlaceholder: '702914801'
  },
  {
    id: 'zzz-monochromes',
    title: 'Zenless Zone Zero · Монохромы + Интернот-подписка',
    platform: 'Zenless Zone Zero',
    category: 'donate',
    region: 'Все серверы (Europe / Asia / America)',
    deliveryType: 'По UID · Без входа в аккаунт',
    priceRub: 1490,
    cashbackPercent: 6,
    image: zzzImg,
    description: 'Пополнение Монохромов и оформление членства в фонде Интернота (Inter-Knot Membership) в ZZZ по UID. Моментальная доставка для круток новых агентов.',
    variants: [
      { id: 'zzz-sub', label: 'Интернот-подписка (30 дней)', priceRub: 390 },
      { id: 'zzz-980', label: '980 + 110 Монохромов', priceRub: 1490 },
      { id: 'zzz-1980', label: '1980 + 260 Монохромов', priceRub: 2990 },
      { id: 'zzz-6480', label: '6480 + 1600 Монохромов', priceRub: 7890 }
    ],
    requiresAccountField: 'Ваш игровой UID в ZZZ (10 цифр)',
    accountPlaceholder: '1004829105'
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'LP-90482',
    date: 'Сегодня, 19:42',
    title: 'Пополнение Steam Кошелька (15 000 ₸)',
    platform: 'Steam',
    targetAccount: 'kratos_main_kz',
    region: 'Казахстан (KZT)',
    amountPaidRub: 3290,
    usedVaultRub: 200,
    cashbackEarned: 148,
    status: 'completed',
    canRefundToVault: false
  },
  {
    id: 'LP-90419',
    date: 'Сегодня, 14:15',
    title: 'Кристаллы Сотворения (980 + 110 шт.)',
    platform: 'HoYoverse',
    targetAccount: 'UID: 719204811 (Ошибочный сервер)',
    region: 'Europe',
    amountPaidRub: 1490,
    usedVaultRub: 0,
    cashbackEarned: 89,
    status: 'failed_network',
    canRefundToVault: true,
    refundReason: 'Код не активирован / Ошибка региона получателя — доступен мгновенный возврат 100% суммы на внутренний баланс без ожидания банка.'
  },
  {
    id: 'LP-89910',
    date: '04 окт 2026',
    title: 'PlayStation Plus Deluxe — 12 Месяцев',
    platform: 'PlayStation Store',
    targetAccount: 'alex.vance@psn.tr',
    region: 'Турция (TR)',
    amountPaidRub: 4890,
    usedVaultRub: 450,
    cashbackEarned: 220,
    status: 'completed',
    canRefundToVault: true,
    refundReason: 'Неактивированный резервный слот — возможен перевод средств обратно в баланс LevelUp.'
  }
];
