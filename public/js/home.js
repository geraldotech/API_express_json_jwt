// get baseurl from server in fronend
const getBASEURL = document.querySelector('p[data-baseurl]').dataset.baseurl


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
fetchToShowinDOM(`${getBASEURL}/products`)

function domHandler(dados) {
 
  document.getElementById('productsCards').innerHTML = dados
    .map(
      (ele) =>
`
<div class="card">
<h2><a href="/products/post/${ele.id}" target="_blank">${ele.name}</a></h2>
<p class="itemid">ID:<span id="singleid">${ele.id}</span></p>
<p>Price: ${ele.price}</p>
<p>${ele.bodyContent?.slice(0, 65) ?? ''}...</p>
<p>
<a class="button secondary smallbtn" href="/products/search/category?q=${ele.category}">${ele.category}</a>
</p>
</div>
`
    )
    .join('')
}