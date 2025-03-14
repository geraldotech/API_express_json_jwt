// get baseurl from server in fronend
const getBASEURL = document.querySelector('p[data-baseurl]').dataset.baseurl

const baseURL = `${getBASEURL}/products/`
const productsadmin = `${getBASEURL}/productsadmin/`

function setSelectedOption(value) {
  const selectCat = document.getElementById('selectCat')
  const options = selectCat.options

  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      options[i].selected = true
      break
    }
  }
}

const goPostPage = document.getElementById('goPostPage')
const productId = document.getElementById('productId').dataset.id
const labelText = document.querySelector('[data=publishedstate]')

// select using FormName to show data from server
let itemId = document.mformPU.id
let itemName = document.mformPU.name
let itemPrice = document.mformPU.price
let createdAt = document.mformPU.createdAt
let published = document.mformPU.published
let itemBodyContent = document.mformPU.itemBodyContent
let itemCategory = document.mformPU.category

let publishedStatus

fetch(`${productsadmin}${productId}`)
  .then((res) => res.json())
  .then((data) => {
    itemId.value = data.id
    createdAt.value = data.createdAt
    itemName.value = data.name
    itemPrice.value = data.price
    itemBodyContent.textContent = data.bodyContent
    // dynamic set selected option
    setSelectedOption(data.category)

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
    //labelText.innerHTML = publishedStatus ? `<i class='bx bx-toggle-left' ></i>` : `<i class='bx bxs-toggle-right' ></i>`
  })
}

setLabelTextFromState()

const mformPU = document.querySelector('#mformPU')

mformPU.onsubmit = function () {
  event.preventDefault()

  const bodyContent = document.getElementById('itemBodyContent')

  // onClick get constructor obj data UPDATE
  let data = {
    name: itemName.value,
    price: itemPrice.value,
    bodyContent: bodyContent.value,
    published: publishedStatus,
    category: itemCategory.value,
  }

  const ajaxn = new XMLHttpRequest()
  ajaxn.open('PUT', `${baseURL}${productId}`)

  /* 
  If you're sending JSON data with your AJAX request and you want to specify both the Content-Type header as application/json and the X-Requested-With header as XMLHttpRequest, you can set both headers before sending the request. Here's how you can do it: */

  // Set Content-Type header to application/json
  ajaxn.setRequestHeader('Content-Type', 'application/json')

  // Set X-Requested-With header to XMLHttpRequest
  ajaxn.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

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

      // Parse the entire response as JSON
      const responseData = JSON.parse(ajaxn.response)

      if (!responseData.auth) {
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
        Swal.fire({
          title: 'Updated!',
          text: responseData.message, // send server response
          icon: 'success',
        })
      }

      if (ajaxn.status === 500) {
        console.log(`deslogado from server`)
      }

      // update DOM products list
      // fetchToShowinDOM(baseURL)
    }
  }
}

/* monta a url de post view dinamicamente a partir da BASEURL E PRODUCT ID */
//goPostPage.href = `${getBASEURL}/products/post/${productId}`
goPostPage.href = `${getBASEURL}/products/post/${location.href.split('/')[location.href.split('/').length - 1]}`
