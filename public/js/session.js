setTimeout(() => {
  swal({
    title: 'Session Expired',
    text: 'Your sessions has expired',
    buttons: ['Go home', 'Login'],
    icon: 'warning',
  }).then((login) => {
    if (login) {
      location.href = '/ghlogin';
    } else {
      location.href = '/';
    }
  });
}, 1000 * 60 * 60);
