document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault()
  const form = event.target
  const formData = new FormData(form)
  const credencials = Object.fromEntries(formData)

  fetch('/login', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(credencials),
  })
    .then((response) => {
      console.log(response)
      if (response.ok) {        
    
          // Get the redirect URL from the response headers
        const redirectUrl = response.redirected ? response.url : ''

        // Redirect the client to the specified URL
       window.location.href = redirectUrl;
     
      } else {
        // Display error message
        return response.json().then((data) => {
          console.log(`data`, data)
          document.getElementById('errorMessage').innerText = data.message
          document.getElementById('errorMessage').style.display = 'block'
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
