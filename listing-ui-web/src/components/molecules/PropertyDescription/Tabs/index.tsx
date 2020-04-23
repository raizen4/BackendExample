import React, { FC, useState, useRef, KeyboardEvent } from 'react';
import { useFormikContext } from 'formik';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import {
  CreateListing,
  CreateListingRoom
} from '../../../organisms/CreateListingForm/types';
import { IPropertyDescriptionTabsProps } from './types';
import RemoveConfirmationDialog from '../../RemoveConfirmationDialog';
import DraggableTabs from '../DraggableTabs';
import { IDraggableTabsRef } from '../DraggableTabs/types';
import { v1 as uuid } from 'uuid';

const tabWidth = 200; // in pixels
const roomFormSelector = 'listingDetails.descriptions.rooms';

const useStyles = makeStyles((theme: Theme) => ({
  tabsRoot: {
    borderBottom: `1px solid ${theme.palette.grey[200]}`
  },
  tabsIndicator: {
    display: 'none'
  },
  tabLabel: {
    flexGrow: 1
  },
  tabRoot: {
    background: theme.palette.background.paper,
    width: tabWidth
  },
  tabWrapper: {
    'flex-direction': 'row-reverse',
    '&> *:first-child': {
      marginBottom: '0!important',
      marginLeft: theme.spacing(1)
    }
  },
  tabSelected: {
    borderBottom: `3px solid ${theme.palette.primary.main}`
  }
}));

const getTabOrder = (rooms: CreateListingRoom[]) => {
  const sortedRooms = [...rooms].sort(
    (prev, next) => prev.displayOrder - next.displayOrder
  );
  return sortedRooms.map(room =>
    rooms.findIndex(formRoom => formRoom.id === room.id)
  );
};

const createNewRoom = (
  id: string,
  displayOrder: number
): CreateListingRoom => ({
  id,
  title: 'New room',
  measurements: {
    width: {
      main: 0,
      sub: 0
    },
    length: {
      main: 0,
      sub: 0
    }
  },
  description: '',
  displayOrder
});

const PropertyDescriptionTabs: FC<IPropertyDescriptionTabsProps> = ({
  tabValue,
  setTabValue
}) => {
  const {
    tabsRoot,
    tabRoot,
    tabLabel,
    tabsIndicator,
    tabWrapper,
    tabSelected
  } = useStyles({});
  const draggableRef = useRef<IDraggableTabsRef | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const formData = useFormikContext<CreateListing>();
  const [tabOrder, setTabOrder] = useState<number[]>(() =>
    getTabOrder(formData.values.listingDetails.descriptions.rooms)
  );
  const currentRooms = formData.values.listingDetails.descriptions.rooms;
  const [showRoomRemovalConfirm, setShowRoomRemovalConfirm] = useState<boolean>(
    false
  );

  const handleTabReorder = (newOrder: number[]): void => {
    if (newOrder.length === currentRooms.length) {
      const newRoomOrder = currentRooms.map((room, i) => ({
        ...room,
        displayOrder: newOrder.indexOf(i)
      }));
      formData.setFieldValue(roomFormSelector, newRoomOrder);
      setTabOrder(newOrder);
    }
  };

  const handleAddNewDescription = (): void => {
    const id = uuid();
    const rooms: CreateListingRoom[] = [
      ...currentRooms,
      createNewRoom(
        id,
        currentRooms.reduce(
          (prev, curr) =>
            prev < curr.displayOrder ? curr.displayOrder + 1 : prev,
          0
        )
      )
    ];
    setTabValue(id);
    setTabOrder(getTabOrder(rooms));
    formData.setFieldValue(roomFormSelector, rooms);
    if (draggableRef.current) {
      draggableRef.current.addTab();
    }
  };

  const onCloseDialog = () => {
    setShowRoomRemovalConfirm(false);
  };

  const removeRoomConfirmationDialog = (roomId: string): void => {
    setSelectedRoomId(roomId);
    setShowRoomRemovalConfirm(!showRoomRemovalConfirm);
  };

  const removeRoom = (roomId: string) => {
    const newRooms = currentRooms.filter(
      (room: CreateListingRoom) => room.id !== roomId
    );
    const removedTabIndex = currentRooms.findIndex(
      (room: CreateListingRoom) => room.id === roomId
    );
    const nextIndex = tabOrder.indexOf(removedTabIndex) - 1;
    const newRearrangedIndex = nextIndex >= 0 ? nextIndex : 1;
    const newTabValue = tabOrder[newRearrangedIndex] || 0;
    setTabOrder(getTabOrder(newRooms));
    formData.setFieldValue(roomFormSelector, newRooms);
    if (draggableRef.current) {
      draggableRef.current.removeTab(removedTabIndex);
    }
    setTabValue(currentRooms[newTabValue].id);
  };

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  const handleKeyboardKeyPress = (
    event: React.KeyboardEvent,
    roomId: string
  ) => {
    event.stopPropagation();
    (event.key === 'Backspace' || event.key === 'Delete') &&
      removeRoomConfirmationDialog(roomId);
  };

  return (
    <>
      {showRoomRemovalConfirm && (
        <RemoveConfirmationDialog
          isOpen={showRoomRemovalConfirm}
          onClose={onCloseDialog}
          roomId={selectedRoomId}
          removeRoom={removeRoom}
          roomTitle={
            formData.values.listingDetails.descriptions.rooms.find(
              (room: CreateListingRoom) => room.id === selectedRoomId
            )?.title ?? ''
          }
        />
      )}
      <DraggableTabs
        className={tabsRoot}
        value={tabValue}
        ref={draggableRef}
        childWidth={tabWidth}
        setValue={setTabValue}
        onOrderChange={handleTabReorder}
        order={tabOrder}
        appendComponent={
          <Tab
            classes={{
              wrapper: tabWrapper,
              selected: tabSelected
            }}
            label={
              <Typography
                className={tabLabel}
                noWrap
                variant="button"
                color="primary"
              >
                Add New
              </Typography>
            }
            value="add"
            icon={<AddIcon color="primary" />}
            onClick={handleAddNewDescription}
          />
        }
        classes={{ indicator: tabsIndicator }}
        onChange={handleTabChange}
        aria-label="Property description sections"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
      >
        {currentRooms.map(function createRoomTab(
          room: { title: string; id: string },
          index: number
        ) {
          const roomTitle =
            room.title !== '' ? room.title : `Room ${index + 1}`;
          const tabProps = {
            label: (
              <Typography className={tabLabel} noWrap variant="button">
                {roomTitle}
              </Typography>
            ),
            id: `${roomTitle.replace(' ', '-')}-tab-${index}`,
            'aria-controls': `${roomTitle}-tabpanel-${index}`
          };
          return (
            <Tab
              classes={{
                root: tabRoot,
                wrapper: tabWrapper,
                selected: tabSelected
              }}
              data-testid="room-tab"
              component="div"
              key={room.id}
              value={room.id}
              icon={
                currentRooms.length > 0 ? (
                  <IconButton
                    aria-label={`Delete ${roomTitle} tab`}
                    onClick={e => {
                      removeRoomConfirmationDialog(room.id);
                      e.stopPropagation();
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : (
                  undefined
                )
              }
              onKeyDownCapture={(event: KeyboardEvent<HTMLDivElement>) =>
                handleKeyboardKeyPress(event, room.id)
              }
              {...tabProps}
            />
          );
        })}
      </DraggableTabs>
    </>
  );
};

export default PropertyDescriptionTabs;
