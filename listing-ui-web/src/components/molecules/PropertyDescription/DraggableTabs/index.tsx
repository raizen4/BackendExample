import React, {
  Children,
  useRef,
  cloneElement,
  useImperativeHandle,
  forwardRef,
  Ref,
  ReactElement
} from 'react';
import { animated, useSprings, interpolate } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import IDraggableTabsProps, { IDraggableTabsRef } from './types';
import { Tabs } from '@material-ui/core';
import swap from 'shared/utils/swap';
import { clamp } from 'shared/utils/clamp';

function DraggableTabs<T>(
  {
    childWidth,
    children,
    appendComponent,
    shadow = 5,
    setValue,
    onOrderChange,
    order: parentOrder = [],
    ...props
  }: IDraggableTabsProps<T>,
  ref: Ref<IDraggableTabsRef>
) {
  const order = useRef<number[]>(
    parentOrder || Children.map(children, (_, i) => i)
  );
  const springify = (
    order: number[],
    down = false,
    originalIndex?: number,
    curIndex?: number,
    x?: number
  ) => (index: number) =>
    down && index === originalIndex
      ? {
          x: Number(curIndex) * Number(childWidth) + Number(x),
          scale: 1,
          zIndex: '1',
          shadow,
          immediate: Boolean((n: string) => n === 'x' || n === 'zIndex')
        }
      : {
          x: order.indexOf(index) * Number(childWidth),
          scale: 1,
          zIndex: '0',
          shadow: 0,
          immediate: false
        };

  const childCount = Children.count(children);
  const [springs, setSprings] = useSprings(
    childCount,
    springify(order.current)
  );

  useImperativeHandle(ref, () => ({
    addTab: (index = order.current.length) => {
      order.current = [
        ...order.current.slice(0, index),
        index,
        ...order.current.slice(index)
      ];
      if (onOrderChange) {
        onOrderChange(order.current);
      }
    },
    removeTab: (originalIndex: number) => {
      const index = order.current.indexOf(originalIndex);
      order.current = [
        ...order.current.slice(0, index),
        ...order.current.slice(index + 1)
      ].map(item => (item < originalIndex ? item : item - 1));
      if (onOrderChange) {
        onOrderChange(order.current);
      }
    }
  }));

  const bind = useGesture({
    onDrag: ({ args: [originalIndex], down, movement: [x] }) => {
      const curIndex = order?.current?.indexOf(originalIndex);
      const curRow = clamp(
        Math.round((Number(curIndex) * childWidth + x) / childWidth),
        0,
        childCount - 1
      );
      const newOrder = swap(order.current || [], Number(curIndex), curRow);
      setSprings(
        (springify(
          newOrder,
          down,
          originalIndex,
          curIndex,
          x
        ) as unknown) as number // type issue with react-spring v8, upgrading to v9 would fix this but it's currently unstable
      );
      if (!down) {
        order.current = newOrder;
        if (onOrderChange) {
          onOrderChange(order.current);
        }
      }
    }
  });

  return (
    <Tabs {...props}>
      {Children.map(children, (child, i: number) => {
        const { zIndex, shadow, x, scale } = springs[i];
        const element = child as JSX.Element;

        return cloneElement(element, {
          ...bind(i),
          component: animated.div,
          onMouseDownCapture: () => {
            setValue(element.props.value);
          },
          key: i,
          style: {
            marginLeft: !i ? '0px' : `-${childWidth}px`,
            zIndex,
            boxShadow: shadow.interpolate(
              s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
            ),
            transform: interpolate(
              [x, scale],
              (x, s) => `translate3d(${x}px, 0, 0) scale(${s})`
            )
          }
        });
      })}

      {appendComponent &&
        cloneElement(appendComponent, {
          style: {
            marginLeft: `${Math.max(
              childWidth * (Children.count(children) - 1),
              0
            )}px`
          }
        })}
    </Tabs>
  );
}

export default forwardRef(DraggableTabs) as <T>(
  p: IDraggableTabsProps<T> & { ref?: Ref<IDraggableTabsRef> }
) => ReactElement;
