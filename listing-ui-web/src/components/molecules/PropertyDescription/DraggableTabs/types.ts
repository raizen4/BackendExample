import { TabsProps } from '@material-ui/core/Tabs';

export type IDraggableTabsRef = Partial<HTMLElement> & {
  addTab: () => void;
  removeTab: (originalIndex: number) => void;
};

type IDraggableTabsProps<T> = Omit<TabsProps, 'onChange' | 'ref'> & {
  appendComponent?: JSX.Element;
  childWidth: number;
  setValue: (value: T) => void;
  onChange?: <C>(event: React.ChangeEvent<C>, value: T) => void;
  onOrderChange?: (indexes: number[]) => void;
  order?: number[];
  shadow?: number;
};

export default IDraggableTabsProps;
