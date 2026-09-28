export const dashboardMetrics = {
  walletBalance: 12458.32,
  totalTrades: 847,
  feesSwap: -234.56,
  totalPnl: 3245.78,
  pnlPercent: 12.4,
  sparkline: [30, 45, 35, 55, 48, 62, 58, 70, 65, 78, 72, 85],
};

export const tradingAccounts = [
  {
    id: "MT5-78234",
    type: "Real" as const,
    leverage: "1:500",
    balance: 5432.1,
    status: "Active",
  },
  {
    id: "MT5-91456",
    type: "VIP" as const,
    leverage: "1:1000",
    balance: 18920.45,
    status: "Active",
  },
  {
    id: "MT5-34521",
    type: "Deluxe" as const,
    leverage: "1:2000",
    balance: 45230.0,
    status: "Active",
  },
];

export const openTrades = [
  {
    ticket: "18294756",
    symbol: "EUR/USD",
    type: "Buy",
    lot: 0.5,
    openPrice: 1.0892,
    profit: 125.4,
    sl: 1.085,
    openTime: "2024-03-15 09:30",
  },
  {
    ticket: "18294801",
    symbol: "GBP/JPY",
    type: "Sell",
    lot: 1.0,
    openPrice: 191.45,
    profit: -45.2,
    sl: 192.0,
    openTime: "2024-03-15 10:15",
  },
  {
    ticket: "18294823",
    symbol: "XAU/USD",
    type: "Buy",
    lot: 0.1,
    openPrice: 2165.3,
    profit: 230.0,
    sl: 2150.0,
    openTime: "2024-03-14 14:00",
  },
  {
    ticket: "18294850",
    symbol: "USD/JPY",
    type: "Sell",
    lot: 0.3,
    openPrice: 149.25,
    profit: 78.9,
    sl: 150.0,
    openTime: "2024-03-15 11:45",
  },
];

export const closedTrades = [
  {
    ticket: "18293100",
    symbol: "EUR/GBP",
    type: "Buy",
    lot: 0.2,
    openPrice: 0.8545,
    profit: 34.2,
    sl: 0.852,
    openTime: "2024-03-12 08:00",
  },
  {
    ticket: "18293200",
    symbol: "AUD/USD",
    type: "Sell",
    lot: 0.5,
    openPrice: 0.658,
    profit: -22.1,
    sl: 0.662,
    openTime: "2024-03-11 15:30",
  },
];

export const fundsHistory = [
  {
    type: "Deposit",
    amount: 5000,
    bonus: 250,
    total: 5250,
    method: "Bank Transfer",
    status: "Completed",
    date: "2024-03-10",
  },
  {
    type: "Withdrawal",
    amount: -1200,
    bonus: 0,
    total: -1200,
    method: "USDT",
    status: "Completed",
    date: "2024-03-08",
  },
  {
    type: "Deposit",
    amount: 2000,
    bonus: 100,
    total: 2100,
    method: "Credit Card",
    status: "Pending",
    date: "2024-03-15",
  },
  {
    type: "Withdrawal",
    amount: -500,
    bonus: 0,
    total: -500,
    method: "Bank Transfer",
    status: "Processing",
    date: "2024-03-14",
  },
];

export const referrals = [
  {
    name: "John D.",
    mobile: "+1****5678",
    email: "john****@mail.com",
    level: "Silver",
  },
  {
    name: "Sarah M.",
    mobile: "+44****1234",
    email: "sarah****@mail.com",
    level: "Gold",
  },
  {
    name: "Mike R.",
    mobile: "+61****9012",
    email: "mike****@mail.com",
    level: "Standard",
  },
];

export const copytraders = [
  {
    name: "AlphaTrader",
    winRate: 78,
    totalTrades: 1245,
    commission: 15,
    profit: 34520,
    avatar: "AT",
  },
  {
    name: "ForexKing",
    winRate: 82,
    totalTrades: 892,
    commission: 20,
    profit: 28900,
    avatar: "FK",
  },
  {
    name: "GoldMaster",
    winRate: 71,
    totalTrades: 2103,
    commission: 10,
    profit: 51200,
    avatar: "GM",
  },
  {
    name: "SwingPro",
    winRate: 85,
    totalTrades: 567,
    commission: 25,
    profit: 19800,
    avatar: "SP",
  },
];

export const heatmapData = [
  { pair: "EUR/USD", change: 0.12, strength: 65 },
  { pair: "GBP/USD", change: -0.34, strength: 42 },
  { pair: "USD/JPY", change: 0.56, strength: 78 },
  { pair: "AUD/USD", change: -0.18, strength: 35 },
  { pair: "USD/CAD", change: 0.08, strength: 55 },
  { pair: "NZD/USD", change: -0.45, strength: 28 },
  { pair: "EUR/GBP", change: 0.22, strength: 60 },
  { pair: "GBP/JPY", change: 0.89, strength: 85 },
  { pair: "EUR/JPY", change: 0.41, strength: 70 },
  { pair: "USD/CHF", change: -0.15, strength: 48 },
  { pair: "XAU/USD", change: 1.25, strength: 92 },
  { pair: "XAG/USD", change: 0.67, strength: 72 },
];

export const screenerData = [
  {
    symbol: "EUR/USD",
    bid: 1.0892,
    ask: 1.0894,
    spread: 2,
    change: 0.12,
    high: 1.092,
    low: 1.0865,
  },
  {
    symbol: "GBP/USD",
    bid: 1.2734,
    ask: 1.2737,
    spread: 3,
    change: -0.34,
    high: 1.278,
    low: 1.271,
  },
  {
    symbol: "USD/JPY",
    bid: 149.25,
    ask: 149.27,
    spread: 2,
    change: 0.56,
    high: 149.5,
    low: 148.8,
  },
  {
    symbol: "XAU/USD",
    bid: 2168.5,
    ask: 2169.0,
    spread: 50,
    change: 1.25,
    high: 2175.0,
    low: 2155.0,
  },
  {
    symbol: "AUD/USD",
    bid: 0.6578,
    ask: 0.658,
    spread: 2,
    change: -0.18,
    high: 0.66,
    low: 0.6555,
  },
];
