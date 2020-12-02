const thumb = (event) => {
  event.preventDefault();
  var thumbIcon = event.target;
  var thumbCounter = event.target.nextElementSibling;
  fetch('/thumb', {
    url: '/thumb',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      thoughtId: thumbIcon.dataset.id,
    }),
  }).then(() => {
    if (thumbIcon.classList.contains('fa-thumbs-o-up')) {
      thumbIcon.classList.remove('fa-thumbs-o-up');
      thumbIcon.classList.add('fa-thumbs-up');
      thumbCounter.innerText = +thumbCounter.innerText + 1;
    } else if (thumbIcon.classList.contains('fa-thumbs-up')) {
      thumbIcon.classList.remove('fa-thumbs-up');
      thumbIcon.classList.add('fa-thumbs-o-up');
      thumbCounter.innerText = +thumbCounter.innerText - 1;
    }
  });
};
