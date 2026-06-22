import { mockOptions } from '../data/mockOptions';
import { calculateWhaleScore, getSignalFlags } from '../utils/whaleScore';
import { classifyFlow, buildInterpretation } from '../utils/flowClassifier';

export async function fetchOptions() {
  return mockOptions.map((option) => {
    const metrics = calculateWhaleScore(option);
    const flow = classifyFlow(option, metrics);

    return {
      ...option,
      ...metrics,
      flow,
      signalFlags: getSignalFlags(option, metrics),
      interpretation: buildInterpretation(option, metrics, flow),
    };
  });
}

export async function fetchSummary(options) {
  const alerts = options.filter((option) => option.whaleScore >= 31);
  const extreme = options.filter((option) => option.alertLevel === 'Alerta extremo');
  const calls = options.filter((option) => option.type === 'CALL' && option.whaleScore >= 31);
  const puts = options.filter((option) => option.type === 'PUT' && option.whaleScore >= 31);
  const totalFinancial = options.reduce((sum, option) => sum + option.financialVolume, 0);
  const top = [...options].sort((a, b) => b.whaleScore - a.whaleScore)[0];
  const byAsset = options.reduce((acc, option) => {
    acc[option.asset] = (acc[option.asset] || 0) + option.financialVolume;
    return acc;
  }, {});
  const concentration = Object.entries(byAsset).sort((a, b) => b[1] - a[1])[0];

  return {
    alerts: alerts.length,
    extreme: extreme.length,
    calls: calls.length,
    puts: puts.length,
    totalFinancial,
    topScore: top,
    concentration: concentration?.[0] || '-',
  };
}
