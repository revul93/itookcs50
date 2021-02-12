const thumb = (event, user) => {
  if (!user) {
    swal({
      title: 'Not logged in',
      text: 'Please login to give this thought a thumb!',
      icon: 'warning',
      buttons: ['Cancel', 'Log me in'],
    }).then((yes) => {
      if (yes) {
        location.href = '/ghlogin';
      }
    });
    return false;
  }
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

const deleteThought = (event) => {
  swal({
    title: 'Delete a thought',
    text: 'Are you sure you want to delete your though?',
    icon: 'warning',
    buttons: ['No', 'Yes'],
  }).then((yes) => {
    if (yes) {
      var deleteIcon = event.target;
      fetch('/deleteThought', {
        url: '/thumb',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thoughtId: deleteIcon.dataset.id,
        }),
      }).then(() => {
        location.reload();
      });
    }
  });
};
