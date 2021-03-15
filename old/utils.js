const range = (end, start = 0, step = 1) => {
  let result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

module.exports = { range };
