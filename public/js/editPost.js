const Production = location.port != ''
const baseURL = Production ? 'http://localhost:3001/products/' : 'https://api.gpdev.tech/products/'
const productsadmin = Production ? 'http://localhost:3001/productsadmin/' : 'https://api.gpdev.tech/productsadmin/'

const productId = document.getElementById('productId').dataset.id
const labelText = document.querySelector('[data=publishedstate]')

// select using FormName
let itemId = document.mformPU.id
let itemName = document.mformPU.name
let itemPrice = document.mformPU.price
let createdAt = document.mformPU.createdAt
let published = document.mformPU.published
let publishedStatus

fetch(`${productsadmin}${productId}`)
  .then((res) => res.json())
  .then((data) => {
    itemId.value = data.id
    createdAt.value = data.createdAt
    itemName.value = data.name
    itemPrice.value = data.price

    published.checked = data.published // send check to button
    publishedStatus = data.published // send check to status
  })

  .catch((error) => {
    console.error('Error fetching product information:', error)
  })

function setLabelTextFromState() {
  published.addEventListener('click', function () {
    publishedStatus = published.checked
    labelText.textContent = publishedStatus ? 'published' : 'unpublished'
  })
}

setLabelTextFromState()

const mformPU = document.querySelector('#mformPU')

mformPU.onsubmit = function () {
  event.preventDefault()

  // constructor obj data
  let data = {
    name: itemName.value,
    price: itemPrice.value,
    published: publishedStatus,
  }

  const ajaxn = new XMLHttpRequest()
  ajaxn.open('PUT', `${baseURL}${productId}`)

  ajaxn.setRequestHeader('content-Type', 'application/json')
  const json = JSON.stringify(data)

  ajaxn.send(json)

  ajaxn.onload = function () {
    // Check if the request was a success
    if (this.readyState === XMLHttpRequest.DONE) {
      // Get and convert the responseText into JSON
      console.log('Request was a success')

      // reset form
      //putSingle.reset()

      // == server response ==
      console.log(ajaxn.status)
      if (ajaxn.status === 201) {
        // Parse the entire response as JSON
        const responseData = JSON.parse(ajaxn.response)
        Swal.fire({
          title: 'Updated!',
          text: responseData.message, // send server response
          icon: 'success',
        })
      }

      // update DOM products list
      // fetchToShowinDOM(baseURL)
    }
  }
}
