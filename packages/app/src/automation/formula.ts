const tradeFormula = (unitsStored: number, volume: number, baseValue: number) => {
  // formula that matches the expected values

  return Math.round(baseValue * (1 - Math.pow(1 - volume / unitsStored, 1 / 2)));
}

const baseStorage = 100;
const baseValue = 10000;

console.log({
  step1: {
    current: tradeFormula(baseStorage, 10, baseValue),
    expected: 35757

  },
  step2: { current: tradeFormula(baseStorage - 10, 10, baseValue), expected: 38913 },
  step3: { current: tradeFormula(baseStorage, 10, baseValue), expected: 35757 },
  step4: { current: tradeFormula(baseStorage + 10, 10, baseValue), expected: 33193 },
  step5: { current: tradeFormula(baseStorage + 20, 10, baseValue), expected: 31110 },
})