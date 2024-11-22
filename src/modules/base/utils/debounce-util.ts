const debounceUtil = (func, delay) => {
  let timeout;
  return (...param) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      func(...param);
    }, delay);
  };
};

export default debounceUtil;
