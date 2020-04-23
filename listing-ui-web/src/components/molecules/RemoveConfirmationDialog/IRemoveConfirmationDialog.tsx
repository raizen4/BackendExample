export interface IRemoveConfirmationDialog {
  roomId: string;
  isOpen: boolean;
  roomTitle: string;
  onClose: () => void;
  removeRoom: (roomId: string) => void;
}
