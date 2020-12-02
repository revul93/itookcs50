var submitButton = document.getElementById('submit-button');
var spinner = document.createElement('img');
spinner.setAttribute('src', '/public/img/submit-spinner.gif');
spinner.setAttribute('class', 'submit-spinner');

document
  .getElementById('shareThoughtForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.replaceWith(spinner);
    if (event.target['subject'].value && event.target['text'].value) {
      try {
        const response = await fetch('/shareThought', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: event.target['subject'].value,
            text: event.target['text'].value,
          }),
        });

        if (response.status !== 200) {
          document.getElementById('errorMessage').classList.remove('d-none');
          spinner.replaceWith(submitButton);
          return;
        }

        const data = await response.json();
        if (!alert(data.message)) {
          location.href = '/thoughts/1';
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      if (event.target['subject'].value === '') {
        event.target['subject'].style.outline = '1px solid red';
        document.getElementById('subjectErrorAlert').classList.remove('d-none');
      }
      if (event.target['text'].value === '') {
        event.target['text'].style.outline = '1px solid red';
        document.getElementById('textErrorAlert').classList.remove('d-none');
      }
    }
    spinner.replaceWith(submitButton);
  });
