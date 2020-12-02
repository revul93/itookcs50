fetch({
  url: '/thumb',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    thoughtId: thought.id,
  },
});

function range(end, start = 0, step = 1) {
  let result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}
