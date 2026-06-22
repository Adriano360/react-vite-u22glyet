const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getDaysToExpiration(expirationDate, now = new Date()) {
  return Math.max(0, Math.ceil((new Date(expirationDate) - now) / MS_PER_DAY));
}

export function getMoneyness(option) {
  const distance = ((option.strike - option.underlyingPrice) / option.underlyingPrice) * 100;

  if (option.type === 'CALL') {
    if (distance <= -1.5) return 'ITM';
    if (Math.abs(distance) <= 3) return 'ATM';
    return 'OTM';
  }

  if (distance >= 1.5) return 'ITM';
  if (Math.abs(distance) <= 3) return 'ATM';
  return 'OTM';
}

export function analyzeOption(option) {
  const avg5 = Math.max(option.averageVolume5d || 1, 1);
  const avg20 = Math.max(option.averageVolume20d || avg5, 1);
  const avgFinancial = Math.max(option.averageFinancialVolume20d || 1, 1);
  const avgTrades = Math.max(option.averageTrades20d || 1, 1);
  const volumeMultiplier5d = option.volume / avg5;
  const volumeMultiplier20d = option.volume / avg20;
  const financialMultiplier = option.financialVolume / avgFinancial;
  const tradesMultiplier = option.trades / avgTrades;
  const strikeDistancePct =
    Math.abs(option.strike - option.underlyingPrice) / option.underlyingPrice * 100;
  const daysToExpiration = getDaysToExpiration(option.expirationDate);
  const optionChangePct =
    option.openPrice > 0 ? ((option.lastPrice - option.openPrice) / option.openPrice) * 100 : 0;
  const spreadPct = option.lastPrice > 0 ? (option.spread / option.lastPrice) * 100 : 0;
  const moneyness = getMoneyness(option);

  return {
    volumeMultiplier5d,
    volumeMultiplier20d,
    financialMultiplier,
    tradesMultiplier,
    strikeDistancePct,
    daysToExpiration,
    optionChangePct,
    underlyingChangePct: option.underlyingVariation,
    spreadPct,
    moneyness,
  };
}

export function getAlertLevel(score, volumeMultiplier20d) {
  if (score >= 86 || volumeMultiplier20d >= 10) return 'Alerta extremo';
  if (score >= 71 || volumeMultiplier20d >= 5) return 'Alerta forte';
  if (score >= 51 || volumeMultiplier20d >= 3) return 'Movimento relevante';
  if (score >= 31) return 'Atencao leve';
  return 'Movimento fraco';
}
