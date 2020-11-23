document
  .getElementById('addThoughtForm')
  .addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event.target['subject']);
    console.log(event.target['text']);
  });
