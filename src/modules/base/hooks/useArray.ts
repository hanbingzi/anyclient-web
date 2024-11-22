import { useState } from 'react';

const useArray = <T>(initialArray: T[]) => {
  const [array, setArray] = useState(initialArray);
  return {
    array,
    setArray,
    add: (item: T) => setArray([...array, item]),
    clear: () => setArray([]),
    removeIndex: (index: number) => {
      const copy = [...array];
      copy.splice(index, 1);
      setArray(copy);
    },
    remove: (value: T) => {
      const newArray = array.filter((item) => {
        return item !== value;
      });
      setArray(newArray);
    },
  };
};

export default useArray;
