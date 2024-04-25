/* == toggle production or devmode */
const Production = location.port != ''
const baseURL = Production ? 'http://localhost:3001/products/' : 'https://api.gpdev.tech/products/'

document.getElementById('base').href = baseURL
document.getElementById('base').innerHTML = baseURL

// POST
const form = document.querySelector('#mform')
form.onsubmit = function (event) {
  event.preventDefault()
  const ajaxn = new XMLHttpRequest()
  const data = new FormData(form)
  ajaxn.open('POST', baseURL)
  ajaxn.setRequestHeader('content-Type', 'application/json')
  // or no json xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  const json = JSON.stringify(Object.fromEntries(data))

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
      console.log(message)
      console.log(product)
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
// DELETE
const formdel = document.querySelector('#mformdel')

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

// PUT

const formPU = document.querySelector('#mformPU')
formPU.onsubmit = function (event) {
  event.preventDefault()
  const ajaxn = new XMLHttpRequest()
  const data = new FormData(formPU)
  //console.log(data.get('id'))
  ajaxn.open('PUT', baseURL + data.get('id'))
  ajaxn.setRequestHeader('content-Type', 'application/json')
  const json = JSON.stringify(Object.fromEntries(data))
  ajaxn.send(json)
  if (ajaxn.readyState == XMLHttpRequest.DONE) {
    console.log('Request was a success')
    formPU.reset()
  }
}

//GET single router
const formGet = document.querySelector('#mformGet')
formGet.onclick = function (event) {
  event.preventDefault()

  const data = new FormData(formGet)
  console.log(data.get('id'))
  const getlink = document.getElementById('get')
  getlink.href = `${baseURL}/post/` + data.get('id')
  getlink.innerHTML = baseURL + data.get('id')
}

/* === GET single === edit and send */

let getSingle = document.querySelector('#getSingle')
const putSingle = document.querySelector('#putSingle')

let [urlSingle, itemName, itemPrice] = ['', '', '']

getSingle.onsubmit = function (event) {
  itemName = document.querySelector('#itemName')
  itemPrice = document.querySelector('#itemPrice')

  event.preventDefault()
  const data = new FormData(getSingle)
  const { itemid } = Object.fromEntries(data)
  urlSingle = `${baseURL}${itemid}`

  console.log(urlSingle)

  fetch(urlSingle)
    .then((req) => req.json())
    .then((data) => {
      console.log(data)
      itemName.value = data.name
      itemPrice.value = data.price
    })
}

putSingle.onsubmit = (e) => {
  e.preventDefault()
  let data = {
    name: itemName.value,
    price: itemPrice.value,
  }

  const ajaxn = new XMLHttpRequest()
  ajaxn.open('PUT', urlSingle)

  ajaxn.setRequestHeader('content-Type', 'application/json')
  const json = JSON.stringify(data)
  ajaxn.send(json)
  ajaxn.onload = function () {
    // Check if the request was a success
    if (this.readyState === XMLHttpRequest.DONE) {
      // Get and convert the responseText into JSON
      console.log('Request was a success')

      // reset form
      putSingle.reset()

      // == server response ==
      console.log(ajaxn.status)
      if (ajaxn.status === 201) {
        // Parse the entire response as JSON
        const responseData = JSON.parse(ajaxn.response)
        console.log(responseData.message)
      }

      // update DOM products list
      // fetchToShowinDOM(baseURL)
    }
  }
}
