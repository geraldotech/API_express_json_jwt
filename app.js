const express = require('express')
const { randomUUID } = require('crypto')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
var bodyParser = require('body-parser')
require('dotenv-safe').config()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const port = 3001
const app = express()


// Parse URL-encoded bodies with extended syntax
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: 'https://api.gpdev.tech', // Allow requests only from this origin
    // allowed Headers: ['Content-Type'], // Allow only specified headers
  })
)

app.use(
  session({
    secret: process.env.SECRET, // Change this to your secret key
    resave: false,
    saveUninitialized: false,
  })
)


/* Array itens */
let products = []

// read json
fs.readFile('products.json', 'utf-8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    products = JSON.parse(data)
  }
})

/* sem cors mesmo na same origin não funciona  */

/* === view engine setup === */

//app.engine("html", require("ejs").renderFile);
//app.set("view engine", "html");
app.set('view engine', 'ejs') //engine irá buscar .ejs
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views'))

// Set the public folder as the location for static files
app.use(express.static(path.join(__dirname, 'public')))

/* === Routers === */

app.get('/', isAuth, (req, res, next) => {
  // console.log(`route /`, req.isAuthenticated)
  // Handle the case where the user is not logged in

  /*   if (!req.notLoggedIn) {
    console.log(`esta logado`)
    res.render('index.ejs', { auth: true, info: 'Express API, cors, ejs' })
  } else {
  } */
  res.render('home.ejs', { auth: req.isAuthenticated, header: 'Express API, cors, ejs, JWT' })
})

app.get('/dashboard', verifyJWT, (req, res) => {
  const userId = req.query.userId // Retrieve userId from query parameters
  console.log(userId)

  // leverage if return userid == loggin
  const isAuth = req.userId ? true : false

  res.render('dashboard.ejs', { info: 'Dashboard', isAuthenticated: isAuth })
})

app.get('/products/post/:id', isAuth, (req, res, next) => {
  const { id } = req.params
  const product = products.find((product) => product.id === id)

  if (!product) {
    // maybe visite same single and return a 404 status
    // or create a 404 page
    return res.render('404.ejs')
  }
  return res.render('single.ejs', { product, auth: req.isAuthenticated })
})

app.get('/products', (req, res) => {
  return res.json(products)
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find((product) => product.id === id)

  return res.json(product)

  // if you return this file as template, will broken single router json
  //return res.render("single.ejs", {product});
})

app.get('/login', (req, res) => {
  res.render('login.ejs', {})
})

// Beta
app.get('/postnew', (req, res) => {
  res.render('post.ejs')
})

app.get('/status', (req, res) => {
  res.send('SERVER IS ON')
})

app.post('/products', verifyJWT, (req, res) => {
  const { name, price } = req.body

  const product = {
    name,
    price,
    id: randomUUID(),
  }

  products.push(product)

  productFile()

  return res.json(product)
})

app.put('/products/:id', verifyJWT, (req, res) => {
  const { id } = req.params
  const { name, price } = req.body

  const productIndex = products.findIndex((product) => product.id === id)

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  }

  productFile()

  return res.json({ message: 'Produto alterado com sucecsso' })
})

app.delete('/products/:id', verifyJWT, (req, res) => {
  const { id } = req.params

  const productIndex = products.findIndex((product) => product.id === id)

  products.splice(productIndex, 1)

  productFile()

  return res.json({ message: 'produto removido com sucesso!' })
})

// JWT authentication
app.post('/login', (req, res, next) => {
  const { user, pwd } = req.body
  //console.log(user)

  //esse teste abaixo deve ser feito no seu banco de dados
  if (req.body.user === 'geraldo' && req.body.pwd === '123') {
    //auth ok
    const id = 1 //esse id viria do banco de dados
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300, // expires in 5min 300
    })
    // Store the token in the session
    req.session.token = token

    // return res.json({ auth: true, token: token })

    // Redirect the user to the dashboard with additional  data
    //// handle post form
    return res.redirect(302, `/dashboard?userId=${id}`)

    
   // return res.status(200).json({ auth: true, token });
  }

  //res.status(500).json({ message: 'Login inválido!' })
  res.status(401).json({ message: 'Login ou senha inválido!' })
})

app.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error('Error destroying session:', err)
      return res.status(500).send('Internal Server Error')
    }
    res.clearCookie('connect.sid')
    return res.redirect('/')
  })
})

/* === Middlewares === */

// Check if the user is authenticated
// some pages no needs protection, but can need knows user is loggin

function isAuth(req, res, next) {
  // Check if the token exists in the sessio
  const token = req.session.token

  if (!token) {
    // If token doesn't exist, user is not logged in
    req.isAuthenticated = false
    return next() // Move to the next middleware/route handler
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      req.isAuthenticated = false
      return next()
    }
    // Token is valid, set user ID in the request object
    req.userId = decoded?.id
    req.isAuthenticated = true
    next() // Move to the next middleware/route handler
  })
}

//função que verifica se o JWT é ok
function verifyJWT(req, res, next) {
  //const token = req.headers['authorization']
  const token = req.session.token

  //console.log(req.session.token)
  if (!token) return res.status(401).send({ auth: false, message: 'Token não informado ou user não logado' })

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'sessão expirada ou Token inválido' })

    req.userId = decoded.id

    next()
  })
}

const helloMiddleware = () => {
  return (req, res, next) => {
    console.log('Hello from custom middleware!')
    next() // Call next to move to the next middleware or route handler
  }
}

/* === functions === */

function productFile() {
  fs.writeFile('products.json', JSON.stringify(products), (err) => {
    if (err) {
      console.log(erro)
    } else {
      console.log('produto inserido')
    }
  })
}

app.listen(port, () => console.log('server listening on port: ' + port))
