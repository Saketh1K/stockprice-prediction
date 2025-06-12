
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
  sparklineData: number[];
  type: 'stock' | 'gold' | 'mutual_fund';
}

// Helper function to generate random stock data
const generateRandomStock = (symbol: string, name: string, sector: string, basePrice: number, type: 'stock' | 'gold' | 'mutual_fund' = 'stock'): Stock => {
  const change = (Math.random() - 0.5) * basePrice * 0.1;
  const changePercent = (change / basePrice) * 100;
  const volume = type === 'mutual_fund' ? Math.floor(Math.random() * 1000000) + 100000 : Math.floor(Math.random() * 50000000) + 1000000;
  
  // Generate market cap based on price and random multiplier
  const shares = Math.floor(Math.random() * 1000000000) + 100000000;
  const marketCapValue = basePrice * shares;
  let marketCap: string;
  
  if (type === 'gold') {
    marketCap = "N/A";
  } else if (type === 'mutual_fund') {
    marketCap = (Math.random() * 50000 + 1000).toFixed(0) + " Cr";
  } else {
    if (marketCapValue >= 1000000000000) {
      marketCap = (marketCapValue / 1000000000000).toFixed(1) + "T";
    } else if (marketCapValue >= 1000000000) {
      marketCap = (marketCapValue / 1000000000).toFixed(1) + "B";
    } else if (marketCapValue >= 10000000) {
      marketCap = (marketCapValue / 10000000).toFixed(1) + "L Cr";
    } else {
      marketCap = (marketCapValue / 1000000).toFixed(1) + "M";
    }
  }
  
  // Generate sparkline data
  const sparklineData = [];
  let currentPrice = basePrice;
  for (let i = 0; i < 8; i++) {
    const variation = (Math.random() - 0.5) * 0.05;
    currentPrice = currentPrice * (1 + variation);
    sparklineData.push(Number(currentPrice.toFixed(2)));
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    symbol,
    name,
    price: Number((basePrice + change).toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    volume,
    marketCap,
    sector,
    sparklineData,
    type
  };
};

// Generate thousands of stocks
const stocksData = [
  // Major US Stocks
  ...["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "META", "NVDA", "NFLX", "ORCL", "CRM", "ADBE", "INTC", "AMD", "QCOM", "CSCO", "IBM", "HPQ", "DELL", "VMW", "SNOW", "PLTR", "UBER", "LYFT", "ABNB", "DOCU", "ZM", "SHOP", "SQ", "PYPL", "COIN", "ROKU", "TWLO", "OKTA", "CRWD", "NET", "DDOG", "MDB", "FSLY", "ESTC", "TEAM"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Inc.`, "Technology", 50 + Math.random() * 500, 'stock')
  ),
  
  // Banking & Finance
  ...["JPM", "BAC", "WFC", "GS", "MS", "C", "USB", "PNC", "TFC", "COF", "AXP", "BLK", "SCHW", "CME", "ICE", "SPGI", "MCO", "V", "MA", "PYPL", "SQ", "FISV", "FIS", "INTU", "ADP", "PAYX"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Corp.`, "Banking", 30 + Math.random() * 200, 'stock')
  ),
  
  // Healthcare & Pharma
  ...["JNJ", "PFE", "UNH", "MRK", "ABT", "TMO", "MDT", "AMGN", "GILD", "BMY", "LLY", "ABBV", "CVS", "CI", "HUM", "ANTM", "DHR", "SYK", "BSX", "EW", "ISRG", "VRTX", "REGN", "BIIB", "MRNA", "NVAX"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Healthcare`, "Healthcare", 40 + Math.random() * 300, 'stock')
  ),
  
  // Indian Stocks (NSE/BSE)
  ...["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "KOTAKBANK", "SBIN", "BHARTIARTL", "ITC", "HINDUNILVR", "ASIANPAINT", "MARUTI", "BAJFINANCE", "HCLTECH", "WIPRO", "ULTRACEMCO", "NESTLEIND", "TITAN", "POWERGRID", "NTPC", "COALINDIA", "ONGC", "TECHM", "SUNPHARMA", "DRREDDY", "CIPLA", "DIVISLAB", "BAJAJFINSV", "AXISBANK", "LT", "TATASTEEL", "HINDALCO", "JSWSTEEL", "INDUSINDBK", "BAJAJ-AUTO", "HEROMOTOCO", "M&M", "TATAMOTORS", "EICHERMOT", "BRITANNIA", "GODREJCP", "DABUR", "MARICO", "COLPAL", "PIDILITIND", "BERGEPAINT", "ASIAN", "INDIGO", "SPICEJET"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol.replace(/[^A-Z]/g, '')} Ltd.`, ["Technology", "Banking", "FMCG", "Auto", "Pharma", "Energy"][Math.floor(Math.random() * 6)], 100 + Math.random() * 3000, 'stock')
  ),

  // Gold ETFs and Gold Schemes
  ...["GOLDIETF", "GOLDBEES", "GOLDSHARE", "GOLDMOZART", "GOLDCASE", "HDFCGOLD", "ICICIGOLD", "SBIGOLD", "KOTAKGOLD", "INVESCOGOLD", "NIFTYGOLDETF", "GOLDPETAL", "EDELGOLD", "LIQUIDGOLD", "GOLDMINE"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Gold ETF`, "Gold", 4500 + Math.random() * 1500, 'gold')
  ),

  // Mutual Funds - Equity Large Cap
  ...["HDFCTOP100", "ICICIPRU500", "SBILARGECAP", "HDFCLARGECAP", "AXISLARGECAP", "KOTAKLARGECAP", "UTINIFTY", "INVESCOLARGECAP", "FRANKLINTEMPLETON", "ADITYABIRLA500"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Large Cap Fund`, "Equity Large Cap", 45 + Math.random() * 200, 'mutual_fund')
  ),

  // Mutual Funds - Equity Mid Cap
  ...["HDFCMIDCAP", "ICICIMIDCAP", "SBIMIDCAP", "KOTAKMIDCAP", "AXISMIDCAP", "INVESCOMIDCAP", "FRANKLINMIDCAP", "ADITYABIRLAMID", "DSPMIDCAP", "L&TMIDCAP"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Mid Cap Fund`, "Equity Mid Cap", 35 + Math.random() * 150, 'mutual_fund')
  ),

  // Mutual Funds - Equity Small Cap
  ...["HDFCSMALLCAP", "ICICISMALLCAP", "SBISMALLCAP", "KOTAKSMALLCAP", "AXISSMALLCAP", "INVESCOSMALLCAP", "FRANKLINSMALL", "ADITYABIRLASMALL", "DSPSMALLCAP", "L&TSMALLCAP"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Small Cap Fund`, "Equity Small Cap", 25 + Math.random() * 100, 'mutual_fund')
  ),

  // Mutual Funds - Debt Funds
  ...["HDFCDEBT", "ICICIULTRASF", "SBIDEBT", "KOTAKDEBT", "AXISDEBT", "INVESCODEBT", "FRANKLINDEBT", "ADITYABIRLADEBT", "DSPDEBT", "L&TDEBT"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Debt Fund`, "Debt", 12 + Math.random() * 25, 'mutual_fund')
  ),

  // Mutual Funds - Hybrid Funds
  ...["HDFCHYBRID", "ICICIHYBRID", "SBIHYBRID", "KOTAKHYBRID", "AXISHYBRID", "INVESCOHYBRID", "FRANKLINHYBRID", "ADITYABIRLAHYBRID", "DSPHYBRID", "L&THYBRID"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Hybrid Fund`, "Hybrid", 18 + Math.random() * 50, 'mutual_fund')
  ),

  // Mutual Funds - ELSS Tax Saving
  ...["HDFCELSS", "ICICIELSS", "SBIELSS", "KOTAKELSS", "AXISELSS", "INVESCOELSS", "FRANKLINELSS", "ADITYABIRLAELSS", "DSPELSS", "L&TELSS"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} ELSS Tax Saver`, "ELSS", 22 + Math.random() * 80, 'mutual_fund')
  ),

  // Mutual Funds - Index Funds
  ...["HDFCINDEX", "ICICIINDEX", "SBIINDEX", "KOTAKINDEX", "AXISINDEX", "INVESCOINDEX", "FRANKLININDEX", "ADITYABIRLAINDEX", "DSPINDEX", "L&TINDEX"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} Index Fund`, "Index", 15 + Math.random() * 40, 'mutual_fund')
  ),

  // Mutual Funds - International Funds
  ...["HDFCINTL", "ICICIINTL", "SBIINTL", "KOTAKINTL", "AXISINTL", "INVESCOINTL", "FRANKLININTL", "ADITYABIRLAINTL", "DSPINTL", "L&TINTL"].map((symbol, index) => 
    generateRandomStock(symbol, `${symbol} International Fund`, "International", 25 + Math.random() * 60, 'mutual_fund')
  ),
];

// Generate additional random stocks to reach 1000+
const additionalSectors = ["Energy", "Utilities", "Real Estate", "Materials", "Consumer Goods", "Industrials", "Telecommunications", "Transportation", "Retail", "Entertainment"];
const randomSymbols = [];

// Generate 800+ more stocks
for (let i = 0; i < 800; i++) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbol = Array.from({length: 3 + Math.floor(Math.random() * 3)}, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const sector = additionalSectors[Math.floor(Math.random() * additionalSectors.length)];
  const basePrice = 1 + Math.random() * 1000;
  randomSymbols.push(generateRandomStock(symbol, `${symbol} Corporation`, sector, basePrice, 'stock'));
}

// Generate additional mutual funds
for (let i = 0; i < 150; i++) {
  const fundTypes = ["Large Cap", "Mid Cap", "Small Cap", "Debt", "Hybrid", "ELSS", "Index", "International"];
  const fundType = fundTypes[Math.floor(Math.random() * fundTypes.length)];
  const symbol = `FUND${i.toString().padStart(3, '0')}`;
  const name = `${symbol} ${fundType} Fund`;
  const basePrice = 10 + Math.random() * 100;
  randomSymbols.push(generateRandomStock(symbol, name, fundType, basePrice, 'mutual_fund'));
}

// Generate additional gold products
for (let i = 0; i < 50; i++) {
  const goldTypes = ["Digital Gold", "Gold ETF", "Gold Bonds", "Gold Savings"];
  const goldType = goldTypes[Math.floor(Math.random() * goldTypes.length)];
  const symbol = `GOLD${i.toString().padStart(2, '0')}`;
  const name = `${symbol} ${goldType}`;
  const basePrice = 4000 + Math.random() * 2000;
  randomSymbols.push(generateRandomStock(symbol, name, goldType, basePrice, 'gold'));
}

export const mockStocks: Stock[] = [...stocksData, ...randomSymbols];

export const generateHistoricalData = (symbol: string) => {
  const data = [];
  const basePrice = mockStocks.find(stock => stock.symbol === symbol)?.price || 100;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const variation = (Math.random() - 0.5) * 0.1;
    const price = basePrice * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  return data;
};

export const generatePredictionData = (symbol: string) => {
  const historicalData = generateHistoricalData(symbol);
  const lastPrice = historicalData[historicalData.length - 1].price;
  const predictions = [];
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const trend = Math.random() > 0.5 ? 1.02 : 0.98;
    const variation = (Math.random() - 0.5) * 0.05;
    const predictedPrice = lastPrice * trend * (1 + variation);
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: Number(predictedPrice.toFixed(2)),
      confidence: Math.random() * 0.3 + 0.7
    });
  }
  
  return predictions;
};
