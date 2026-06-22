export function classifyFlow(option, metrics) {
  const isCall = option.type === 'CALL';
  const isPut = option.type === 'PUT';
  const nearMoney = metrics.moneyness === 'ATM';
  const shortTerm = metrics.daysToExpiration <= 18;
  const highVolume = metrics.volumeMultiplier20d >= 5;
  const assetUp = option.underlyingVariation > 0.6;
  const assetDown = option.underlyingVariation < -0.6;
  const wideSpread = metrics.spreadPct > 10;

  if (isCall && highVolume && nearMoney && assetUp && !shortTerm) {
    return 'Fluxo Direcional de Alta';
  }

  if (isPut && highVolume && assetDown && option.impliedVolatility >= 38) {
    return 'Protecao Institucional';
  }

  if (isPut && highVolume && assetDown) {
    return 'Fluxo Direcional de Baixa';
  }

  if (isCall && metrics.moneyness === 'OTM' && shortTerm && highVolume) {
    return 'Especulacao de Curto Prazo';
  }

  if (option.relatedFlow === 'spread') {
    return 'Possivel Trava';
  }

  if (isCall && option.openInterest > option.volume * 2 && metrics.moneyness !== 'OTM') {
    return 'Possivel Venda Coberta';
  }

  if (option.relatedFlow === 'rollover') {
    return 'Possivel Rolagem';
  }

  if (wideSpread || metrics.volumeMultiplier20d < 3) {
    return 'Movimento Sem Confirmacao';
  }

  return isCall ? 'Fluxo Direcional de Alta' : 'Fluxo Direcional de Baixa';
}

export function buildInterpretation(option, metrics, flow) {
  const direction =
    option.type === 'CALL'
      ? 'CALL com assimetria de alta'
      : 'PUT com assimetria defensiva ou direcional de baixa';
  const liquidity =
    option.trades >= 500 ? 'boa liquidez' : option.trades >= 150 ? 'liquidez moderada' : 'liquidez limitada';
  const strike =
    metrics.moneyness === 'ATM'
      ? 'strike proximo do preco atual'
      : metrics.moneyness === 'ITM'
        ? 'strike dentro do dinheiro'
        : 'strike fora do dinheiro';

  return `${direction}, volume ${metrics.volumeMultiplier20d.toFixed(1)}x acima da media de 20 pregoes, ${liquidity}, ${strike} e vencimento em ${metrics.daysToExpiration} dias. Leitura automatica: ${flow}.`;
}
