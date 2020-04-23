import {
  convertToImperial,
  convertToMetric,
  IDimensionMeasurement
} from './unitConversion';

interface IImperialMetricValues {
  metric: IDimensionMeasurement;
  imperial: IDimensionMeasurement;
}

const testValues: Array<IImperialMetricValues> = [
  { metric: { main: 0, sub: 0 }, imperial: { main: 0, sub: 0 } },
  { metric: { main: 0, sub: 99 }, imperial: { main: 3, sub: 3 } },
  { metric: { main: 2, sub: 49 }, imperial: { main: 8, sub: 2 } },
  { metric: { main: 10000, sub: 1 }, imperial: { main: 32808, sub: 5 } }
];

describe('Unit Conversion', () => {
  describe('converting to imperial', () => {
    it('should return the correct values', () => {
      testValues.forEach(val => {
        expect(convertToImperial(val.metric)).toMatchObject(val.imperial);
      });
    });
  });

  describe('converting to metric', () => {
    it('should return the correct values', () => {
      testValues.forEach(val => {
        expect(convertToMetric(val.imperial)).toMatchObject(val.metric);
      });
    });
  });
});
