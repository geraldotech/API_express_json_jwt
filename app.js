import express from 'express'
import { randomUUID } from 'crypto'
import fs from 'fs'
import cors from 'cors'
import path from 'path'
import bodyParser from 'body-parser'
import dotenv from 'dotenv-safe'
dotenv.config()
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { getSlugFromString } from './utils/getSlugFromString.js'
import { createdAt } from './utils/createdAt.js'

console.log(process.env.BASEURL)

const port = 3001
const app = express()

// Parse URL-encoded bodies with extended syntax
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: '*', // Allow requests only from this origin
    methods: ['GET'], // Allow only specified methods
    allowedHeaders: ['Content-Type'], // Allow only specified headers
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
/* app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views')) */

// Serve static files from the 'public' directory

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Serve static files from the '/views' directory
app.use(express.static(join(__dirname, 'views')))

// Serve static files from the '/public' directory
app.use(express.static(join(__dirname, 'public')))

/* === Routers === */

app.get('/', isAuth, (req, res, next) => {
  // console.log(`route /`, req.isAuthenticated)
  // Handle the case where the user is not logged in

  /*   if (!req.notLoggedIn) {
    console.log(`esta logado`)
    res.render('index.ejs', { auth: true, info: 'Express API, cors, ejs' })
  } else {
  } */
  res.render('home.ejs', { auth: req.isAuthenticated, header: 'Express API, cors, ejs, JWT', isAuthenticated: isAuth, baseURL: process.env.BASEURL })
})

// router dashboard and create post

app.get('/dashboard/:action?', verifyJWT, (req, res) => {
  const userId = req.query.userId // Retrieve userId from query parameters
  // leverage if return userid == loggin
  const isAuth = req.userId ? true : false

  const { action } = req.params
  if (action === 'createnew') {
    // Handle 'createnew' action
    return res.render('createPost.ejs', { info: 'Dashboard', isAuthenticated: isAuth })
  }

  if (action === 'edit') {
    return res.send('edit template')
  }
  return res.render('dashboard.ejs', { info: 'Dashboard', isAuthenticated: isAuth })
})

// router edit and delete verifyJWT
app.get('/dashboard/edit/:id', verifyJWT, (req, res) => {
  const userId = req.query.userId // Retrieve userId from query parameters
  // leverage if return userid == loggin
  const isAuth = req.userId ? true : false

  const { id } = req.params
  res.render('editPost.ejs', { info: 'Dashboard', isAuthenticated: isAuth, id: id })

  //return res.render('createPost.ejs', { info: 'Dashboard', isAuthenticated: isAuth } );
})

app.get('/dashboard/delete/:id', (req, res) => {
  const { id } = req.params

  res.render('deletePost.ejs', { info: 'Dashboard', isAuthenticated: isAuth, id: id })
})

app.get('/products/post/:id', isAuth, (req, res, next) => {
  const { id, slug } = req.params
  const product = products.find((product) => product.id === id && product.published)

  if (!product) {
    // maybe visite same single and return a 404 status
    // or create a 404 page
    return res.render('404.ejs', { isAuthenticated: isAuth})
  }
  return res.render('single.ejs', { product, auth: req.isAuthenticated })
})

app.get('/products', (req, res) => {
  //filter
  const published = products.filter((post) => post.published === true)

  // chooice what send to client
  const sendPosts = published?.map(({ id, name, price, bodyContent }) => {
    return {
      id,
      name,
      price,
      bodyContent
    }
  })
  return res.json(sendPosts)
})

// router autenticada envia todos os produtos para o dashboard
app.get('/allproducts', verifyJWT, (req, res) => {
  return res.json(products)
})

/* app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find((product) => product.id === id)
  const {action} = req.query
  console.log(action)
  if(action === 'edit'){
    console.log(`is a admin request`)
  } */
app.get('/products/:id', (req, res) => {
  const { id } = req.params

  ///console.log(`is a admin request`)
  const product = products.find((product) => product.id === id && product.published)
  if (!product) {
    res.send('not found')
  }
  return res.json(product)

  // if you return this file as template, will broken single router json
  //return res.render("single.ejs", {product});
})

// router autenticada envia todo os produtos para o editAdmin
app.get('/productsadmin/:id', verifyJWT, (req, res) => {
  const { id } = req.params

  ///console.log(`is a admin request`)
  const product = products.find((product) => product.id === id)
  return res.json(product)

  // if you return this file as template, will broken single router json
  //return res.render("single.ejs", {product});
})

app.get('/login', (req, res) => {
  res.render('login.ejs', {})
})

app.post('/products', verifyJWT, (req, res) => {
  let { name, price, bodyContent, published } = req.body

  const maxLength = 60

  // nem precisa, mais caso input nao tenha o attribute required send a message
  if (!name && !price) {
    return res.status(406).json({ message: 'Fill out the fields' })
  }

  let nameTruncated = name
  if (name.length > maxLength) {
    name = nameTruncated.slice(0, maxLength)
  }

  const product = {
    id: randomUUID(),
    name,
    price,
    bodyContent,
    slug: getSlugFromString(name),
    createdAt: createdAt(),
    published,
  }

  products.push(product)

  productFile()

  //return res.json(product)
  // essa messageos optional?
  return res.status(201).json({ message: 'Product created successfully', product: product })
})

app.put('/products/:id', verifyJWT, (req, res) => {
  const { id } = req.params
  const { name, price, bodyContent, published } = req.body

  const productIndex = products.findIndex((product) => product.id === id)

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
    bodyContent,
    published,
  }

  productFile()

  return res.status(201).send({ message: 'Your product has been updated successfully!' })
})

app.delete('/products/:id', verifyJWT, (req, res) => {
  const { id } = req.params

  const productIndex = products.findIndex((product) => product.id === id)

  products.splice(productIndex, 1)

  productFile()

  //return res.json({ message: 'produto removido com sucesso!' })
  return res.status(200).send({ message: 'Product deleted successfully' })
})

// example multiple params and optional router
app.get('/movies/:name?/:id?', (req, res) => {
  const product = req.params

  console.log(product)
  // Access the category and id parameters
  // Perform operations based on the parameters
  // return res.render('movie.ejs', {product})

  return res.render('movie.ejs', { product, current: process.env.BASEURL, envobj: process.env })
})

app.get('/status', (req, res) => {
  res.json({ status: 201, message: 'SERVER IS ON' })
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
      expiresIn: 300, // expires in 5min 300 // 600 10min
    })
    // Store the token in the session
    req.session.token = token

    // return res.json({ auth: true, token: token })

    // Redirect the user to the dashboard with additional  data
    //// handle post form

    // redirect with params
    //  return res.redirect(302, `/dashboard?userId=${id}`)
    return res.redirect(302, `/dashboard`)

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
  /*   if (!token) return res.status(401).send({ auth: false, message: 'Token não informado ou user não logado' }) */
  if (!token) return res.status(401).send('<p>session expired <a href="/login">Sign in</a> </p>')

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    // if (err) return res.status(500).send({ auth: false, message: 'sessão expirada ou Token inválido' })

    // handler custom return if ajax or browser
    if (err) {
      if (req.xhr) {
        return res.status(500).json({ auth: false, message: 'sessão expirada ou Token inválido' })
      } else {
        return res.status(500).send('<p>sessão expirada ou Token inválido <a href="/login">login</a></p>')
      }
    }

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
      console.log(err)
    } else {
      console.log('writeFile 201')
    }
  })
}

app.listen(port, () => console.log('server listening on port: ' + port))
