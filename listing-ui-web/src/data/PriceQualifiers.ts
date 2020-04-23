interface IPriceQualifier {
  [key: string]: string;
}

export const PriceQualifiers: IPriceQualifier[] = [
  {
    ComingSoon: 'Coming Soon'
  },
  {
    FixedPrice: 'Fixed Price'
  },
  {
    From: 'From'
  },
  {
    GuidePrice: 'Guide Price'
  },
  {
    OffersInExcessOf: 'Offers In Excess Of'
  },
  {
    OffersInvited: 'Offers Invited'
  },
  {
    OffersOver: 'Offers Over'
  },
  {
    OIRO: 'Offers In The Region Of'
  },
  {
    PartBuyPartRent: 'Part Buy Part Rent'
  },
  {
    POA: 'Price On Application'
  },
  {
    SaleByTender: 'Sale By Tender'
  },
  {
    SharedOwnership: 'Shared Ownership'
  },
  {
    SharedEquity: 'Shared Equity'
  }
];
