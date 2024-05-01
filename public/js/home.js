/* == toggle production or devmode */

// se nao tem porta
const Production = location.port != ''
const baseURL = Production ? 'http://localhost:3001/products/' : 'https://api.gpdev.tech/products/'
//console.log(`baseURL`, baseURL)

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
fetchToShowinDOM(baseURL)

function domHandler(dados) {
 
  document.getElementById('productsCards').innerHTML = dados
    .map(
      (ele) =>
`
<div class="card">
<h2><a href="/products/post/${ele.id}" target="_blank">${ele.name}</a></h2>
<p class="itemid">ID:<span id="singleid">${ele.id}</span></p>
<p>Price: ${ele.price}</p>
<p>${ele?.bodyContent?.slice(0, 65) ?? ''}...</p>
<p >
<a class="button secondary smallbtn" href="/products/search/category?q=${ele.category}">${ele.category}</a>
</p>
</div>
`
    )
    .join('')
}