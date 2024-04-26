# API express json jwt
### Express() server +  FormData + Ajax + jsonwebtoken + express session

This project setup a RestAPI with all methods, no database is used, files are stored in a local .json file

- https://http.cat/

## [Live Demo](https://api.gpdev.tech/)

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

- GET /products // only published itens
- GET /allproducts // auth router for dashboard

- GET /products/:id
- GET /status
- GET /products/post/:id

// example multiple params and optional router
- GET /movies/:name?/:id? 
    - /movies/american/2

- PUT /products/:id
- DELETE /products/:id

- POST /products


// POST body
{
"name":"bisXtra",
"price":"5",
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
changes in post, put routes
render body in homepage, single, edit forms


```

## Pages

- /
- /login
- /dashboard



## About cors:

[https://expressjs.com/en/resources/middleware/cors.html](https://expressjs.com/en/resources/middleware/cors.html)
[REF](https://www.youtube.com/watch?v=fm4_EuCsQwg)

## JWT implementation thanks to [ref](https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/)

