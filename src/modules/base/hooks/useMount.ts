import { useEffect } from 'react';

const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
  }, []);
  //[callback]);
};

export default useMount;
