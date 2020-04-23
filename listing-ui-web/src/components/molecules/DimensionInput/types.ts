export interface IDimensionInputProps {
  direction: Directions;
  name: string;
  unit: string;
}

export enum Directions {
  WIDTH = 'width',
  LENGTH = 'length'
}
