document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const form = event.target;
  
  const formData = new FormData(form);
  const credencials = Object.fromEntries(formData)

  
  
  fetch('/login', {
      method: 'POST',
      body:JSON.stringify({
          name: 'geraldo',
          pwd: '123'
        }
      )
  })
  .then(response => {
    console.log(response)
      if (response.ok) {
          // Redirect to the dashboard
          window.location.href = '/dashboard';
      } else {
          // Display error message
          return response.json().then(data => {
            console.log(data.message)
             // document.getElementById('errorMessage').innerText = data.message;
             // document.getElementById('errorMessage').style.display = 'block';
          });
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
});