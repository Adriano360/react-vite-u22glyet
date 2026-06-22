import { analyzeOption, getAlertLevel } from './anomalyEngine';

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function normalize(value, target) {
  return clamp((value / target) * 100);
}

export function calculateWhaleScore(option) {
  const metrics = analyzeOption(option);
  const volumePower = normalize(metrics.volumeMultiplier20d, 10);
  const moneyPower = normalize(option.financialVolume, 1500000);
  const liquidityPower = normalize(option.trades, 900);
  const strikePower = clamp(100 - metrics.strikeDistancePct * 12);
  const timePower = metrics.daysToExpiration <= 4 ? 35 : clamp(100 - Math.abs(metrics.daysToExpiration - 35) * 1.4);
  const pricePower = normalize(Math.abs(metrics.optionChangePct), 45);
  const assetPower = normalize(Math.abs(option.underlyingVariation), 4);
  const repetitionPower = normalize(option.flowRepetition || 1, 5);
  const concentrationPower = normalize(option.expirationConcentration || 1, 5);
  const spreadPenalty = metrics.spreadPct > 12 ? 16 : metrics.spreadPct > 7 ? 8 : 0;

  const score =
    volumePower * 0.24 +
    moneyPower * 0.16 +
    liquidityPower * 0.12 +
    strikePower * 0.12 +
    timePower * 0.08 +
    pricePower * 0.09 +
    assetPower * 0.07 +
    repetitionPower * 0.06 +
    concentrationPower * 0.06 -
    spreadPenalty;

  const whaleScore = Math.round(clamp(score));

  return {
    ...metrics,
    whaleScore,
    confidenceScore: calculateConfidenceScore(option, metrics, whaleScore),
    alertLevel: getAlertLevel(whaleScore, metrics.volumeMultiplier20d),
  };
}

export function calculateConfidenceScore(option, metrics, whaleScore) {
  const spreadQuality = clamp(100 - metrics.spreadPct * 7);
  const tradeQuality = normalize(option.trades, 650);
  const moneyQuality = normalize(option.financialVolume, 900000);
  const historyQuality = normalize(metrics.volumeMultiplier5d + metrics.volumeMultiplier20d, 12);
  const moneynessQuality = metrics.moneyness === 'ATM' ? 100 : metrics.moneyness === 'ITM' ? 82 : 62;
  const scoreQuality = whaleScore;

  return Math.round(
    clamp(
      spreadQuality * 0.2 +
        tradeQuality * 0.2 +
        moneyQuality * 0.18 +
        historyQuality * 0.18 +
        moneynessQuality * 0.12 +
        scoreQuality * 0.12
    )
  );
}

export function getSignalFlags(option, metrics) {
  const flags = [];

  if (metrics.volumeMultiplier20d >= 5) flags.push('Volume anormal');
  if (option.financialVolume >= 250000) flags.push('Financeiro relevante');
  if (metrics.moneyness === 'ATM') flags.push('Strike proximo');
  if (metrics.spreadPct <= 5) flags.push('Spread controlado');
  if (option.trades >= 250) flags.push('Boa frequencia');
  if (metrics.daysToExpiration <= 18) flags.push('Vencimento curto');
  if (metrics.spreadPct > 10) flags.push('Spread largo');

  return flags;
}

export function scoreLabel(score) {
  if (score >= 86) return 'Alerta extremo';
  if (score >= 71) return 'Alerta forte';
  if (score >= 51) return 'Movimento relevante';
  if (score >= 31) return 'Atencao leve';
  return 'Movimento fraco';
}
