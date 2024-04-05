/* == toggle production or devmode */
const Production = location.port != ''
const baseURL = Production ? 'http://localhost:3001/products/' : 'https://api.gpdev.tech/products/'

async function fetchToShowinDOM(url) {
  try {
    const req = await fetch(url)
    const res = await req.json()
    console.warn('baseURL: ', baseURL)
    //  console.table(res)
    domHandler(res)
  } catch (err) {
    console.log(err)
  }
}
fetchToShowinDOM(baseURL)

function domHandler(dados) {
  document.querySelector('.container').insertAdjacentHTML(
    'afterend',
    `
<table>

<tr>
${dados.map((dados) => Object.values(dados.name).join('')).join('<tr><td>')}
</table>
`
  )

  document.getElementById('productsCards').innerHTML = dados
    .map(
      (ele) =>
        `
<div class="card">
<h2><a href="/products/post/${ele.id}" target="_blank">${ele.name}</a></h2>
<p class="itemid">ID:<span id="singleid">${ele.id}</span></p>
<p>Price: ${ele.price}</p>
</div>
`
    )
    .join('')
}

/* fetch local host */
const apiLocal = baseURL

async function tryFetchLocalHost(url = apiLocal) {
  try {
    const req = await fetch(url)
    const res = await req.json()
    console.warn(res)
  } catch (err) {
    console.log(err)
  }
}
