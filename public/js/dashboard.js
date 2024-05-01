/* == toggle production or devmode */
const Production = location.port != ''
const baseURL = Production ? 'http://localhost:3001/products/' : 'https://api.gpdev.tech/products/'
const productsadmin = Production ? 'http://localhost:3001/productsadmin/' : 'https://api.gpdev.tech/productsadmin/'

// document.getElementById('base').href = baseURL
// document.getElementById('base').innerHTML = baseURL

// POST
const form = document.querySelector('#formCreate')
const selectCat = document.querySelector('#selectCat')

if (form) {
  form.onsubmit = function (event) {
    event.preventDefault()

    const ajaxn = new XMLHttpRequest()
    const data = new FormData(form)

    ajaxn.open('POST', baseURL)
    //  ajaxn.setRequestHeader('content-Type', 'application/json')
    // or no json xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Set Content-Type header to application/json
    ajaxn.setRequestHeader('Content-Type', 'application/json')

    // Set X-Requested-With header to XMLHttpRequest
    ajaxn.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    const objData = Object.fromEntries(data)
    // console.log(`json`, objData)

    // append the published  obj and boolean value
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

      const responseData = JSON.parse(ajaxn.response)
      if (!responseData.auth || ajaxn.status === 500) {
        //alert(`um novo login is required`)
        Swal.fire({
          title: 'session expired!',
          text: 'new login required',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = '/login'
          }
        })
      }

      if (ajaxn.status === 201) {
        // Parse the entire response as JSON
        const responseData = JSON.parse(ajaxn.response)

        const { message, product } = responseData
        Swal.fire(message)
      }

      // auto redirect no sweetAlert is required
      // if (ajaxn.status === 500) {
      //   const errorResponse = JSON.parse(ajaxn.responseText)
      //   console.error('Internal Server Error:', errorResponse.message)
      //   alert(errorResponse.message)
      //   setTimeout(() => (window.location = '/login'), 1000)
      // }
    }
    ajaxn.onerror = function () {
      // Network error
      console.error('Network Error')
    }

    ajaxn.send(json)
  }
}

/* show DOM */

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

// before ejs send obj direct html was build here
// was required a special router, now not, obj is send direct from node server
//fetchToShowinDOM(baseallproducts)

function domHandler(dados) {
  const listAll = document.querySelector('#listall')

  if (listAll) {
    listAll.innerHTML += dados
      .map((val) => {
        return `<div>
        <span>
        <a href="/products/post/${val.id}">${val.name?.slice(0, 25)}...</a>
        </span> 
        <span>published:${val.published}</span>  
        <span class="buttons"><a href="/dashboard/edit/${val.id}" class="button secondary">EDIT</a>
        <button class="button danger" data-item="${val.id}">DELETE</button></span>  
         </div>`
      })
      .join(' ')
  }
}

// === DELETE handler ===

// now just send the eventOnclick to get items id and makd direct ajax delete
addEventDelete()

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
  //ajaxn.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  // this request to server detect that is a ajax request
  ajaxn.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  ajaxn.send()
  ajaxn.onload = function (e) {
    // Check if the request was a success
    if (this.readyState === XMLHttpRequest.DONE) {
      // Get and convert the responseText into JSON
      console.log('Request was a success')

      // == server response ==

      const responseData = JSON.parse(ajaxn.response)
      if (!responseData.auth) {
        //alert(`um novo login is required`)
        Swal.fire({
          title: 'session expired!',
          text: 'new login required',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = '/login'
          }
        })
      }

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

/* === DIALOG === */

const btn = document.querySelectorAll('#openModal')
const dialog = document.querySelector('dialog[dialog]')
const btnClose = document.querySelector('dialog[dialog] button') // busca o btn dentro da tag dialog

const name = document.querySelector('dialog[dialog] #name')
const bodyContent = document.querySelector('dialog[dialog] #bodyContent')
const createdAt = document.querySelector('dialog[dialog] #createdAt')
const price = document.querySelector('dialog[dialog] #price')




btn.forEach((link) => {
  link.addEventListener('click', (e) => {
    dialog.showModal()
    const id = e.target.dataset.productid

    fetch(`${productsadmin}${id}`)
      .then((r) => r.json())
      .then((data) => {
        name.textContent = data.name
        bodyContent.innerHTML = data.bodyContent
        createdAt.textContent = data.createdAt
        price.textContent = data.price
      })
  })
})

btnClose.onclick = () => dialog.close()

// const productId = document.querySelector("#openModal")

// console.log(productId.dataset.productid)
