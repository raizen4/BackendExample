import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import Tab from '@material-ui/core/Tab';
import { render, fireEvent, wait } from '@testing-library/react';
import DraggableTabs from '.';

const tabWidth = 200;
let selectedTab = 0;

const TestComponent: FC = () => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [currentOrder, setCurrentOrder] = useState<number[]>([0, 1, 2]);
  useEffect(() => {
    selectedTab = currentValue;
  }, [currentValue]);

  const handleChange = (_: ChangeEvent<{}>, value: number) => {
    setCurrentValue(value);
  };

  return (
    <DraggableTabs<number>
      onChange={handleChange}
      setValue={setCurrentValue}
      onOrderChange={setCurrentOrder}
      order={currentOrder}
      value={currentValue}
      childWidth={tabWidth}
      shadow={5}
    >
      <Tab value={0} label="Tab 0" />
      <Tab value={1} label="Tab 1" />
      <Tab value={2} label="Tab 2" />
    </DraggableTabs>
  );
};

const tabHasPosition = (tab: HTMLElement, position: number) => {
  return (
    tab.parentElement?.style.transform ===
    `translate3d(${position * tabWidth}px, 0, 0) scale(1)`
  );
};

describe('DraggableTabs', () => {
  beforeEach(() => {
    selectedTab = 0;
  });

  it('should initially render tags in order', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    expect(tabs).toHaveLength(3);
    tabs.forEach((tab, i) => {
      expect(tab.innerHTML).toBe(`Tab ${i}`);
    });
  });

  it('should have correct order on 1 move right', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    fireEvent.mouseDown(tabs[0], { clientX: tabWidth / 2, clientY: 25 });
    fireEvent.mouseMove(tabs[0], {
      clientX: tabWidth,
      clientY: 25,
      buttons: 1
    });
    fireEvent.mouseUp(tabs[0]);
    await wait(async () => {
      expect(tabHasPosition(tabs[1], 0)).toBeTruthy();
      expect(tabHasPosition(tabs[0], 1)).toBeTruthy();
    });
  });

  it('should have correct order on 1 move left', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    fireEvent.mouseDown(tabs[1], { clientX: tabWidth / 2, clientY: 25 });
    fireEvent.mouseMove(tabs[1], {
      clientX: -tabWidth,
      clientY: 25,
      buttons: 1
    });
    fireEvent.mouseUp(tabs[1]);
    await wait(async () => {
      expect(tabHasPosition(tabs[1], 0)).toBeTruthy();
      expect(tabHasPosition(tabs[0], 1)).toBeTruthy();
    });
  });

  it('should have correct order on 2 move right', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    fireEvent.mouseDown(tabs[0], { clientX: tabWidth / 2, clientY: 25 });
    fireEvent.mouseMove(tabs[0], {
      clientX: tabWidth * 2,
      clientY: 25,
      buttons: 1
    });
    fireEvent.mouseUp(tabs[0]);
    await wait(async () => {
      expect(tabHasPosition(tabs[1], 0)).toBeTruthy();
      expect(tabHasPosition(tabs[2], 1)).toBeTruthy();
      expect(tabHasPosition(tabs[0], 2)).toBeTruthy();
    });
  });

  it('should have correct order on 2 move left', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    fireEvent.mouseDown(tabs[2], { clientX: tabWidth / 2, clientY: 25 });
    fireEvent.mouseMove(tabs[2], {
      clientX: -(tabWidth * 2),
      clientY: 25,
      buttons: 1
    });
    fireEvent.mouseUp(tabs[2]);
    await wait(async () => {
      expect(tabHasPosition(tabs[1], 2)).toBeTruthy();
      expect(tabHasPosition(tabs[2], 0)).toBeTruthy();
      expect(tabHasPosition(tabs[0], 1)).toBeTruthy();
    });
  });

  it('should return tab to position with insufficient movement', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    fireEvent.mouseDown(tabs[0], { clientX: tabWidth / 2, clientY: 25 });
    fireEvent.mouseMove(tabs[0], {
      clientX: tabWidth / 2 - 10,
      clientY: 25,
      buttons: 1
    });
    fireEvent.mouseUp(tabs[2]);
    await wait(async () => {
      expect(tabHasPosition(tabs[0], 0)).toBeTruthy();
      expect(tabHasPosition(tabs[1], 1)).toBeTruthy();
      expect(tabHasPosition(tabs[2], 2)).toBeTruthy();
    });
  });

  it('should not apply margin to first tab', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    expect(tabs[0].parentElement?.style.marginLeft).toBe('0px');
  });

  it('should apply negative tab width margin to rest of tabs', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const [, ...otherTabs] = queryAllByText(/Tab \d/i);
    otherTabs.forEach(tab => {
      expect(tab.parentElement?.style.marginLeft).toBe(`-${tabWidth}px`);
    });
  });

  it('should not have shadow if not selected', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const tabs = queryAllByText(/Tab \d/i);
    tabs.forEach(tab => {
      expect(tab.parentElement?.style.boxShadow).toBe(
        'rgba(0, 0, 0, 0.15) 0px 0px 0px 0px'
      );
    });
  });

  it('should have shadow when selected', async () => {
    const { queryAllByText } = render(<TestComponent />);
    const [firstTab] = queryAllByText(/Tab \d/i);
    fireEvent.mouseDown(firstTab, { clientX: tabWidth / 2, clientY: 25 });
    fireEvent.mouseMove(firstTab, {
      clientX: tabWidth / 2 - 10,
      clientY: 25,
      buttons: 1
    });
    await wait(() => {
      expect(firstTab.parentElement?.style.boxShadow).toBe(
        'rgba(0, 0, 0, 0.15) 0px 5px 10px 0px'
      );
    });
  });

  it('should select the tab on mousedown', async () => {
    const { queryAllByText } = render(<TestComponent />);
    expect(selectedTab).toBe(0);
    const [, secondTab] = queryAllByText(/Tab \d/i);
    fireEvent.mouseDown(secondTab, { clientX: tabWidth / 2, clientY: 25 });
    await wait(() => {
      expect(selectedTab).toBe(1);
    });
  });
});
