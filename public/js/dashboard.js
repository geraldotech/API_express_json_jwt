/* == toggle production or devmode */
const Production = location.port != ''
const baseURL = Production ? 'http://localhost:3001/products/' : 'https://api.gpdev.tech/products/'
const baseallproducts = Production ? 'http://localhost:3001/allproducts' : 'https://api.gpdev.tech/allproducts'

// document.getElementById('base').href = baseURL
// document.getElementById('base').innerHTML = baseURL

// POST
const form = document.querySelector('#mform')

if (form) {
  form.onsubmit = function (event) {
    event.preventDefault()

    const ajaxn = new XMLHttpRequest()
    const data = new FormData(form)

    ajaxn.open('POST', baseURL)
    ajaxn.setRequestHeader('content-Type', 'application/json')
    // or no json xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    const objData = Object.fromEntries(data)

    objData.published = document.getElementById('published').checked

    const json = JSON.stringify(objData)

    ajaxn.onload = function (e) {
      // Check if the request was a success
      if (this.readyState === XMLHttpRequest.DONE) {
        // Get and convert the responseText into JSON
        console.log('Request was a success')
        // reset form
        form.reset()
      }

      // === get all server response ===

      if (ajaxn.status === 0) {
        console.log(`usuario fazer login novamente`)
        console.log(ajaxn)
      }

      if (ajaxn.status === 201) {
        // Parse the entire response as JSON
        const responseData = JSON.parse(ajaxn.response)

        const { message, product } = responseData
        Swal.fire(message)
      }

      if (ajaxn.status === 500) {
        const errorResponse = JSON.parse(ajaxn.responseText)
        console.error('Internal Server Error:', errorResponse.message)
        alert(errorResponse.message)
        setTimeout(() => (window.location = '/login'), 1000)
      }
    }
    ajaxn.onerror = function () {
      // Network error
      console.error('Network Error')
    }

    ajaxn.send(json)
  }
}

// DELETE
const formdel = document.querySelector('#mformdel')

if (formdel) {
  formdel.onsubmit = function (event) {
    event.preventDefault()
    const ajaxn = new XMLHttpRequest()
    const data = new FormData(formdel)
    console.log(data.get('id'))

    ajaxn.open('DELETE', baseURL + data.get('id'))
    ajaxn.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    ajaxn.send()
    ajaxn.onload = function (e) {
      // Check if the request was a success
      if (this.readyState === XMLHttpRequest.DONE) {
        // Get and convert the responseText into JSON
        console.log('Request was a success')

        // reset form
        formdel.reset()

        // == server response ==
        if (ajaxn.status === 200) {
          // Parse the entire response as JSON
          const responseData = JSON.parse(ajaxn.response)
          console.log(responseData)
        }
      }
    }
  }
}

async function fetchToShowinDOM(url) {
  try {
    const req = await fetch(url)
    const res = await req.json()
    //  console.table(res)
    domHandler(res)
  } catch (err) {
    console.log(err)
  }
}

fetchToShowinDOM(baseallproducts)

function domHandler(dados) {
  const listAll = document.querySelector('#listall')

  if (listAll) {
    listAll.innerHTML += dados
      .map((val) => {
        return `<div><span>${val.name}</span>  <span><a href="/dashboard/edit/${val.id}">EDIT</a>   <button data-item="${val.id}">DELETE</button></span></div>`
      })
      .join(' ')
  }
  addEventDelete()
}

// === DELETE handler ===

function addEventDelete() {
  const deleteItem = document.querySelectorAll('[data-item]')

  deleteItem.forEach((val) => {
    val.addEventListener('click', (event) => {
      const itemClick = event.currentTarget.dataset.item

      //confirm
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteHandler(itemClick)
        }
      })
    })
  })
}

function deleteHandler(id) {
  const ajaxn = new XMLHttpRequest()

  ajaxn.open('DELETE', baseURL + id)
  ajaxn.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  ajaxn.send()
  ajaxn.onload = function (e) {
    // Check if the request was a success
    if (this.readyState === XMLHttpRequest.DONE) {
      // Get and convert the responseText into JSON
      console.log('Request was a success')
      // == server response ==
      if (ajaxn.status === 200) {
        // Parse the entire response as JSON
        const responseData = JSON.parse(ajaxn.response)
        console.log(responseData)
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload()
          }
        })
      }
    }
  }
}

// === DELETE handler ===
