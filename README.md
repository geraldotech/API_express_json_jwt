# API express json jwt

### Express() server + FormData + Ajax + jsonwebtoken + express session

This project setup a RestAPI with all methods, no database is used, files are stored in a local .json file

- https://http.cat/

## [Live Demo](http://168.75.87.178/)

## :rocket: usage:

```js
# install dependencies
    $ npm install

# Execute a aplicação
 $ npm run dev

# set BASEUrl Production or Dev

# Install REST Client for VSCode to test methods

# set cors origin
```

### baseURL

are smart to detect local or domain deploy

### dashboard.ejs before ejs send obj direct html was build here

was required a special router, now not, obj is send direct from node server fetchToShowinDOM(baseallproducts)

### Pages how build:

```js

// Header.ejs // use main.js for all pages
<html>
<head>

<script src="/js/main.js" defer></script>
<head>
<body>
<header>
</header>

// Edit.ejs
// import
 <%- include('./partials/Header', { isAuthenticated: isAuthenticated }); %>


// add custom js only on footer
<script src="myCustom.js"></script>
</body>
</html>
```

# Routers:

```js

- GET /status // server status
- GET /products // only published itens
- GET /allproducts // auth router for dashboard

- GET /products/:id
- GET /products/post/:id

// example multiple params and optional router
- GET /movies/:name?/:id?
    - /movies/american/2

- PUT /products/:id
- DELETE /products/:id

- POST /products


// POST body
{
"name":"bisXtra", //required
"price":"5", //required
"published" true

"slug":"bisxtra", // auto
"createdAt":"20/04/24 18:54:17", // auto
"id":"ecaa22f1-4da7-45ce-b4b0-a5132ecc600b" // auto
"}

// coming soon obj
"body" // description...
"imageUrl": // url
"stock": 0, // number
"category:": select a category: list from a list.json


// to implement new obj
changes in post, app.put ..., render body in homepage?, single?, edit forms and write

```

## Pages

- /
- /login
- /dashboard
  - /dashboard/edit
- /products/post/:id
  - /products/search/category?q=hardware

## send to front process.env.BASEURL

- first render page router send obj gettings process.env value ` return res.render('movie.ejs', { product, current: process.env.BASEURL })`
- ejs receibe value and use as attribute ` <p id="datacurrent" data-current="<%= current %>">process.env.BASEURL </p>`
- clientside getvalue, check movie.ejs, move.js files

## trick until setup the env

```js
const Production = location.port != ''
const baseURL = Production ? 'http://localhost:3001/products/' : 'https://api.gpdev.tech/products/'
const productsadmin = Production ? 'http://localhost:3001/productsadmin/' : 'https://api.gpdev.tech/productsadmin/'
```

## About cors:

[https://expressjs.com/en/resources/middleware/cors.html](https://expressjs.com/en/resources/middleware/cors.html)
[REF](https://www.youtube.com/watch?v=fm4_EuCsQwg)

## JWT implementation thanks to [ref](https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/)


## Render as html in ejs


To render HTML content within a template using EJS, you should use `<%- %>` tags instead of `<%= %>.` The `<%- %>` tags will interpret the content as raw HTML, allowing it to render the HTML elements properly.

Here's how you can render the bodyContent variable as HTML: `<p>body: <%- product.bodyContent %> </p>`