export const debounce = (callee, timeoutMs) => {
  let lastCall = null;
  let lastCallTimer = null;

  return (...args) => {
    const previousCall = lastCall;
    lastCall = Date.now();

    if (previousCall && lastCall - previousCall <= timeoutMs) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
};
