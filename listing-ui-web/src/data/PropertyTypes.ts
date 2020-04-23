interface IPropertyType {
  [key: string]: string;
}

export const PropertyTypes: IPropertyType[] = [
  {
    NotSpecified: 'Not Specified'
  },
  {
    Bungalow: 'Bungalow'
  },
  {
    Commercial: 'Commercial'
  },
  {
    FlatOrApartment: 'Flat Or Apartment'
  },
  {
    House: 'House'
  },
  {
    Land: 'Land'
  },
  {
    Other: 'Other'
  },
  {
    ParkHome: 'Park Home'
  }
];
