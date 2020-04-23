export interface ISaveFormProps {
  actions: ISaveFormAction[];
  className?: string;
  addIcon?: boolean;
}

export interface ISaveFormAction {
  icon: JSX.Element;
  name: string;
  enabled?: boolean;
  onClick?: () => void;
}
