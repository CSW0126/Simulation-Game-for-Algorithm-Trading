const {SO, ADX_, RSI_, SMA, calculateEMA, MACD_} = require('../component/helper.js');

describe('SO', () => {
  test('calculates the Stochastic Oscillator correctly', () => {
    const data = [
      { h: 11711.47, l: 11577.35, c: 11670.75 },
      { h: 11698.22, l: 11635.74, c: 11691.18 },
      { h: 11742.68, l: 11652.89, c: 11722.89 },
      { h: 11736.74, l: 11667.46, c: 11697.31 },
      { h: 11726.94, l: 11599.68, c: 11674.76 },
      { h: 11677.33, l: 11573.87, c: 11637.45 },
      { h: 11704.12, l: 11635.48, c: 11671.88 },
      { h: 11782.23, l: 11673.62, c: 11755.44 },
      { h: 11757.25, l: 11700.53, c: 11731.9 },
      { h: 11794.15, l: 11698.83, c: 11787.38 },
      ];
    const period = 5;
    const expected = [
      {h: 11711.47, l: 11577.35, c: 11670.75, SO5: null},
      {h: 11698.22, l: 11635.74, c: 11691.18, SO5: null},
      {h: 11742.68, l: 11652.89, c: 11722.89, SO5: null},
      {h: 11736.74, l: 11667.46, c: 11697.31, SO5: null},
      {h: 11726.94, l: 11599.68, c: 11674.76, SO5: "58.92"},
      {h: 11677.33, l: 11573.87, c: 11637.45, SO5: "37.66"},
      {h: 11704.12, l: 11635.48, c: 11671.88, SO5: "58.06"},
      {h: 11782.23, l: 11673.62, c: 11755.44, SO5: "87.14"},
      {h: 11757.25, l: 11700.53, c: 11731.90, SO5: "75.84"},
      {h: 11794.15, l: 11698.83, c: 11787.38, SO5: "96.93"},
    ];
    expect(SO(data, period)).toEqual(expected);
  });
});

describe('ADX', () => {
  const testData = [
    { h: 938.7, l: 931.2, c: 932.35 },
    { h: 933.9, l: 930.4, c: 933.5 },
    { h: 933.5, l: 932, c: 932.2 },
    { h: 932.3, l: 931, c: 931.1 },
    { h: 931.5, l: 929.05, c: 931.4 },
    { h: 931.9, l: 930.5, c: 931.9 },
    { h: 933.1, l: 931.85, c: 933 },
    { h: 933, l: 932, c: 932.5 },
    { h: 932.9, l: 931.5, c: 932.15 },
    { h: 932.7, l: 931.4, c: 932 },
    { h: 932.3, l: 928.1, c: 929.55 },
    { h: 930.7, l: 929.35, c: 929.65 },
    { h: 930.15, l: 926.2, c: 927.8 },
    { h: 928, l: 926.7, c: 927.95 },
    { h: 929.75, l: 927.95, c: 929.05 },
    { h: 930.5, l: 929.05, c: 930.1 },
    { h: 931.65, l: 930.05, c: 931 },
    { h: 931.1, l: 930.55, c: 930.9 },
    { h: 931.05, l: 930.55, c: 930.95 },
    { h: 931.75, l: 930.4, c: 931.15 },
    { h: 934, l: 930.8, c: 933.7 },
    { h: 933.65, l: 930.95, c: 931.4 },
    { h: 931.95, l: 930.1, c: 931.2 },
    { h: 932, l: 931.05, c: 931.65 },
    { h: 932.2, l: 930.8, c: 931.75 },
    { h: 932, l: 930.3, c: 930.7 },
    { h: 930.75, l: 929.5, c: 930.05 },
    { h: 931.35, l: 930, c: 930.55 },
    { h: 930.75, l: 929.5, c: 929.8 },
    { h: 930.15, l: 929.1, c: 929.95 },
    { h: 930.9, l: 929.6, c: 930.1 },
    { h: 930.1, l: 928, c: 928.75 },
    { h: 929.3, l: 925.35, c: 926.4 },
    { h: 927.8, l: 925.95, c: 927.65 },
    { h: 928.25, l: 926.7, c: 927.5 },
    { h: 929.45, l: 926.05, c: 926.75 },
    { h: 926.85, l: 924.15, c: 926.45 },
    ];

  const expectedOutput = [
    { h: 938.7, l: 931.2, c: 932.35, ADX: null },
    { h: 933.9, l: 930.4, c: 933.5, ADX: null },
    { h: 933.5, l: 932, c: 932.2, ADX: null },
    { h: 932.3, l: 931, c: 931.1, ADX: null },
    { h: 931.5, l: 929.05, c: 931.4, ADX: null },
    { h: 931.9, l: 930.5, c: 931.9, ADX: null },
    { h: 933.1, l: 931.85, c: 933, ADX: null },
    { h: 933, l: 932, c: 932.5, ADX: null },
    { h: 932.9, l: 931.5, c: 932.15, ADX: null },
    { h: 932.7, l: 931.4, c: 932, ADX: null },
    { h: 932.3, l: 928.1, c: 929.55, ADX: null },
    { h: 930.7, l: 929.35, c: 929.65, ADX: null },
    { h: 930.15, l: 926.2, c: 927.8, ADX: null },
    { h: 928, l: 926.7, c: 927.95, ADX: null },
    { h: 929.75, l: 927.95, c: 929.05, ADX: null },
    { h: 930.5, l: 929.05, c: 930.1, ADX: null },
    { h: 931.65, l: 930.05, c: 931, ADX: null },
    { h: 931.1, l: 930.55, c: 930.9, ADX: null },
    { h: 931.05, l: 930.55, c: 930.95, ADX: null },
    { h: 931.75, l: 930.4, c: 931.15, ADX: null },
    { h: 934, l: 930.8, c: 933.7, ADX: null },
    { h: 933.65, l: 930.95, c: 931.4, ADX: null },
    { h: 931.95, l: 930.1, c: 931.2, ADX: null },
    { h: 932, l: 931.05, c: 931.65, ADX: null },
    { h: 932.2, l: 930.8, c: 931.75, ADX: null },
    { h: 932, l: 930.3, c: 930.7, ADX: null },
    { h: 930.75, l: 929.5, c: 930.05, ADX: null },
    { h: 931.35, l:930, c: 930.55, ADX: 22.38 },
    { h: 930.75, l: 929.5, c: 929.8, ADX: 22.17 },
    { h: 930.15, l: 929.1, c: 929.95, ADX: 22.21 },
    { h: 930.9, l: 929.6, c: 930.1, ADX: 21.59 },
    { h: 930.1, l: 928, c: 928.75, ADX: 21.93 },
    { h: 929.3, l: 925.35, c: 926.4, ADX: 23.33 },
    { h: 927.8, l: 925.95, c: 927.65, ADX:24.63},
    { h: 928.25, l: 926.7, c: 927.5, ADX: 25.45 },
    { h: 929.45, l: 926.05, c: 926.75, ADX: 25.22 },
    { h: 926.85, l: 924.15, c: 926.45, ADX: 25.82 }
  ];

  test('calculates the ADX correctly', () => {
    expect(ADX_(testData)).toEqual(expectedOutput);
  });
});

describe('RSI_ function', () => {
  it('calculates RSI correctly', () => {
    const testData = [
      { "c": 45.15 },
      { "c": 46.26 },
      { "c": 46.5 },
      { "c": 46.23 },
      { "c": 46.08 },
      { "c": 46.03 },
      { "c": 46.83 },
      { "c": 47.69 },
      { "c": 47.54 },
      { "c": 49.25 },
      { "c": 49.23 },
      { "c": 48.2 },
      { "c": 47.57 },
      { "c": 47.61 },
      { "c": 48.08 },
      { "c": 47.21 },
      { "c": 46.76 },
      { "c": 46.68 },
      { "c": 46.21 },
      { "c": 47.47 },
      { "c": 47.98 },
      { "c": 47.13 },
    ];
    const expectedOutput = [
      { "c": 45.15, RSI14: null },
      { "c": 46.26, RSI14: null },
      { "c": 46.5, RSI14: null },
      { "c": 46.23, RSI14: null },
      { "c": 46.08, RSI14: null },
      { "c": 46.03, RSI14: null },
      { "c": 46.83, RSI14: null },
      { "c": 47.69, RSI14: null },
      { "c": 47.54, RSI14: null },
      { "c": 49.25, RSI14: null },
      { "c": 49.23, RSI14: null },
      { "c": 48.2, RSI14: null },
      { "c": 47.57, RSI14: null },
      { "c": 47.61, RSI14: null },
      { "c": 48.08, RSI14: 69.46 },
      { "c": 47.21, RSI14: 61.77},
      { "c": 46.76 , RSI14: 58.18},
      { "c": 46.68 , RSI14: 57.54},
      { "c": 46.21 , RSI14: 53.80},
      { "c": 47.47 , RSI14: 61.10},
      { "c": 47.98 , RSI14: 63.61},
      { "c": 47.13 , RSI14: 57.01},

    ];
    const result = RSI_(testData, 14);
    expect(result).toEqual(expectedOutput);
  });
});

describe('SMA function', () => {
  it('should calculate the SMA values correctly', () => {
    const data = [
      {c: 1},
      {c: 2},
      {c: 3},
      {c: 4},
      {c: 5},
      {c: 6},
      {c: 7},
      {c: 8},
      {c: 9},
      {c: 10},
    ];

    const periods = 5;

    const expectedOutput = [
      {c: 1, sma5: null},
      {c: 2, sma5: null},
      {c: 3, sma5: null},
      {c: 4, sma5: null},
      {c: 5, sma5: 3},
      {c: 6, sma5: 4},
      {c: 7, sma5: 5},
      {c: 8, sma5: 6},
      {c: 9, sma5: 7},
      {c: 10, sma5: 8},
    ];

    expect(SMA(data, periods)).toEqual(expectedOutput);
  });
});

describe('calculateEMA function', () => {
  it('calculate the EMA values correctly', () => {
    const data = [
      {c: 10},
      {c: 15},
      {c: 13},
      {c: 17},
      {c: 19},
      {c: 16},
      {c: 18},
      {c: 14},
      {c: 11},
      {c: 12},
    ];

    const period = 5;

    const expectedOutput =         [
      10, 
      11.67, 
      12.11,
      13.74, 
      15.49, 
      15.66,
      16.44, 
      15.63, 
      14.09,
      13.39
 ]

    expect(calculateEMA(data, period)).toEqual(expectedOutput);
  });
});

describe('MACD function', () => {
  it('calculate the MACD values correctly', () => {
    const historicalData = [
      {c: 459.99},
      {c: 448.85},
      {c: 446.06},
      {c: 450.81},
      {c: 442.8},
      {c: 448.97},
      {c: 444.57},
      {c: 441.4},
      {c: 430.47},
      {c: 420.05},
      {c: 431.14},
      {c: 425.66},
      {c: 430.58},
      {c: 431.72},
      {c: 437.87},
      {c: 428.43},
      {c: 428.35},
      {c: 432.5},
      {c: 443.66},
      {c: 455.72},
      {c: 454.49},
      {c: 452.08},
      {c: 452.73},
      {c: 461.91},
      {c: 463.58},
      {c: 461.14},
      {c: 452.08},
      {c: 442.66},
      {c: 428.91},
      {c: 429.79},
      {c: 431.99},
      {c: 427.72},
      {c: 423.2},
      {c: 426.21},
      {c: 426.98},
      {c: 435.69},
      {c: 434.33}
    ];

    const expectedOutput = [
      {c: 459.99, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 448.85, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 446.06, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 450.81, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 442.8, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 448.97, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 444.57, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 441.4, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 430.47, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 420.05, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 431.14, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 425.66, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 430.58, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 431.72, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 437.87, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 428.43, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 428.35, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 432.5, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 443.66, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 455.72, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 454.49, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 452.08, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 452.73, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 461.91, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 463.58, MACDLine: 0, signalLine: 0, MACDHistogram: 0},
      {c: 461.14, MACDLine: 8.28, signalLine: 0, MACDHistogram: 0},
      {c: 452.08, MACDLine: 7.70, signalLine: 0, MACDHistogram: 0},
      {c: 442.66, MACDLine: 6.42, signalLine: 0, MACDHistogram: 0},
      {c: 428.91, MACDLine: 4.24, signalLine: 0, MACDHistogram: 0},
      {c: 429.79, MACDLine: 2.55, signalLine: 0, MACDHistogram: 0},
      {c: 431.99, MACDLine: 1.38, signalLine: 0, MACDHistogram: 0},
      {c: 427.72, MACDLine: 0.10, signalLine: 0, MACDHistogram: 0},
      {c: 423.2, MACDLine: -1.26, signalLine: 0, MACDHistogram: 0},
      {c: 426.21, MACDLine: -2.07, signalLine: 3.04, MACDHistogram: -5.11},
      {c: 426.98, MACDLine: -2.62, signalLine: 1.91, MACDHistogram: -4.53},
      {c: 435.69, MACDLine: -2.33, signalLine: 1.06, MACDHistogram: -3.39},
      {c: 434.33, MACDLine: -2.18, signalLine: 0.41, MACDHistogram: -2.59}
    ];

    expect(MACD_(historicalData)).toEqual(expectedOutput);
  });
});
