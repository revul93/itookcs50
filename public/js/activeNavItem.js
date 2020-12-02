document.querySelectorAll('.navbar-link').forEach((link) => {
  if (link.href.includes(document.location.href)) {
    link.classList.add('active');
  }
});
