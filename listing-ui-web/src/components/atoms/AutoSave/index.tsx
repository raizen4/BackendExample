import React, { useRef, useEffect, FC } from 'react';
import { useFormikContext } from 'formik';
import { CreateListing } from '../../organisms/CreateListingForm/types';

interface IAutoSaveProps {
  saveDelaySeconds: number;
}

const AutoSave: FC<IAutoSaveProps> = ({ saveDelaySeconds }) => {
  const form = useFormikContext<CreateListing>();

  useInterval(async () => {
    await form.submitForm();
  }, saveDelaySeconds * 1000);
  return <></>;
};
export default AutoSave;

///https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => {}, delay: number) {
  const savedCallback = useRef<() => {}>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    } else {
      return () => {};
    }
  }, [delay]);
}
