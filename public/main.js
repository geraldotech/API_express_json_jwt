/* == toggle production or devmode */
const Production = true
const baseURL = Production ? 'https://api.gpdev.tech/products/' : 'http://localhost:3001/products/'

document.getElementById('base').href = baseURL
document.getElementById('base').innerHTML = baseURL

// post
const form = document.querySelector('#mform')
form.onsubmit = function (event) {
  event.preventDefault()
  const ajaxn = new XMLHttpRequest()
  const data = new FormData(form)
  ajaxn.open('POST', baseURL)
  ajaxn.setRequestHeader('content-Type', 'application/json')
  const json = JSON.stringify(Object.fromEntries(data))
  ajaxn.send(json)

  ajaxn.onload = function (e) {
    // Check if the request was a success
    if (this.readyState === XMLHttpRequest.DONE) {
      // Get and convert the responseText into JSON
      console.log(`cadastrado com sucesso!`)
      // reset form
      form.reset()
    }
  }
}
// DELETE
const formdel = document.querySelector('#mformdel')
// antes de seletar
// preencher os inputs do form

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
      console.log(`produto DELETADO`)
      // reset form
      formdel.reset()
    }
  }
}

// PUT

const formPU = document.querySelector('#mformPU')
formPU.onsubmit = function (event) {
  event.preventDefault()
  const ajaxn = new XMLHttpRequest()
  const data = new FormData(formPU)
  console.log(data.get('id'))
  ajaxn.open('PUT', baseURL + data.get('id'))
  ajaxn.setRequestHeader('content-Type', 'application/json')
  const json = JSON.stringify(Object.fromEntries(data))
  ajaxn.send(json)
  if (ajaxn.readyState == XMLHttpRequest.DONE) {
    formPU.reset()
    console.log(`Produto alterado`)
  }
}

//GET
const formGet = document.querySelector('#mformGet')
formGet.onclick = function (event) {
  event.preventDefault()

  const data = new FormData(formGet)
  console.log(data.get('id'))
  const getlink = document.getElementById('get')
  getlink.href = baseURL + data.get('id')
  getlink.innerHTML = baseURL + data.get('id')
}

//fetch

async function fetchToShowinDOM(url) {
  try {
    const req = await fetch(url)
    const res = await req.json()
    console.warn('dados from:', baseURL)
    //  console.table(res)
    domHanlder(res)
  } catch (err) {
    console.log(err)
  }
}
fetchToShowinDOM(baseURL)

function domHanlder(dados) {
  const tableHead = document.querySelector('thead')
  const tableBody = document.querySelector('tbody')

  const headers = ['name', 'pro', 'id']

  document.querySelector('.container').insertAdjacentHTML('afterend', `<table><tr><th>${dados.map((dados) => Object.values(dados.name).join('')).join('<tr><td>')}</table>`)
  document.getElementById('allItems').innerHTML = dados
    .map(
      (ele) => `<ul>
   <li>Name: <a href="/products/${ele.id}" target="_blank">${ele.name}</a>  ID:<span id="singleid">${ele.id}</span> Price: ${ele.price}</li>
   </ul>`
    )
    .join('')
}

/* fetch local host */
const apiLocal = 'http://localhost:3001/products'

async function tryFetchLocalHost(url = apiLocal) {
  try {
    const req = await fetch(url)
    const res = await req.json()
    console.warn(res)
  } catch (err) {
    console.log(err)
  }
}

/* == GET single === edit and send */

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
      console.log(`Produto alterado com sucesso!`)
      // reset form
      putSingle.reset()
    }
  }
}

