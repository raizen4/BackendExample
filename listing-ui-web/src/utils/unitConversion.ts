export interface IDimensionMeasurement {
  main: number;
  sub: number;
}

export const convertToMetric = (
  val: IDimensionMeasurement
): IDimensionMeasurement => {
  const valInMeters = val.main * 0.3048 + val.sub * 0.0254;
  let wholeMeters = Math.floor(valInMeters);
  let wholeCM = Math.round((valInMeters - wholeMeters) * 100);
  if (wholeCM >= 100) {
    wholeMeters++;
    wholeCM = wholeCM - 100;
  }
  return { main: wholeMeters, sub: wholeCM };
};

export const convertToImperial = (
  val: IDimensionMeasurement
): IDimensionMeasurement => {
  const metricVal = val.main + val.sub / 100;

  const valInFeet = metricVal / 0.3048;
  const wholeFt = Math.floor(valInFeet);
  const valInInches = metricVal / 0.0254;
  const wholeInches = Math.round(valInInches - wholeFt * 12);
  return { main: wholeFt, sub: wholeInches };
};
