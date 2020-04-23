interface IExemptionReason {
  [key: string]: string;
}

export const ExemptionReasons: IExemptionReason[] = [
  {
    CommercialUse: 'Commercial Use'
  },
  {
    Seasonal: 'Seasonal Accomodation'
  },
  {
    NewBuild: 'New Build'
  },
  {
    DeemedUninhabitable: 'Deemed Uninhabitable'
  },
  {
    Other: 'Other'
  }
];

export const ExemptionReasonsAsRegex = () => {
  const regexString = ExemptionReasons.reduce<string>(
    (previousValue: string, currentValue: IExemptionReason): string => {
      return `${previousValue}|${currentValue[Object.keys(currentValue)[0]]}`;
    },
    ''
  );
  return new RegExp(regexString);
};
