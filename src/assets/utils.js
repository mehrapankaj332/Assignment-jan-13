export const calculateHeatmapColor = (value, min, max) => {
  if (min === max) return 'rgb(255, 255, 0)';
  const ratio = (value - min) / (max - min);
  let r, g;
  if (ratio < 0.5) {
    r = Math.round(ratio * 2 * 255);
    g = 255;
  } else {
    r = 255;
    g = Math.round((1 - (ratio - 0.5) * 2) * 255);
  }
  return `rgb(${r}, ${g}, 0)`;
};

export const calculatePercentageDiff = (supplierRate, estimatedRate) => {
  if (!estimatedRate || estimatedRate === 0) return 'N/A';
  const diff = ((supplierRate - estimatedRate) / estimatedRate) * 100;
  return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
};

