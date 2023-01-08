const parse = (data) => {
  return JSON.parse(data);
};

const keyCodes = {
  ENTER: 13,
};

const keyupListener = (e, keyCode, callback) => {
  var key = e.which || e.keyCode;
  key === keyCode && callback();
};

const focus = (id) => {
  try {
    document.querySelector(id).focus();
  } catch (e) {}
};

const isValidEmail = (e) => {
  let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return e.match(reg);
};

export { parse, keyCodes, keyupListener, isValidEmail, focus };
