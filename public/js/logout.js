document.querySelector('#logout').addEventListener('submit', async e => {
  e.preventDefault()

  fetch('/users/logout', {
    method: 'DELETE',
  }).then(() => location.href = '/')
})