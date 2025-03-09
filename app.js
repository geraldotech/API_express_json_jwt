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
import { isAuth } from './utils/isAuth.js'
import { verifyJWT } from './utils/verifyJWT.js'
import { movies } from './routes/movies.js'
import { categories } from './utils/getCategories.js'

const port = 3001
const app = express()

// if user dont define this variable, so get localhost
// send it to files that use fetch
const domainNAME = process.env.DOMAINNAME || `http://localhost:${port}`
const BASEURL = process.env.BASEURL || `http://localhost:${port}`
console.log(`your using url`, BASEURL)

//console.log(process.env.BASEURL)

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
fs.readFile('./db/products.json', 'utf-8', (err, data) => {
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
  res.render('home.ejs', { auth: req.isAuthenticated, header: 'Express API, cors, ejs, JWT', isAuthenticated: isAuth, BASEURL })
})

// router dashboard and create post

app.get('/dashboard/:action?', verifyJWT, async (req, res) => {
  try {
    const userId = req.query.userId // Retrieve userId from query parameters
    // leverage if return userid == loggin
    const isAuth = req.userId ? true : false

    const { action } = req.params

    // Handle 'createnew' action
    if (action === 'createnew') {
      const allcats = await categories()
      return res.render('createPost.ejs', { info: 'Dashboard', isAuthenticated: isAuth, allcats, BASEURL })
    }

    if (action === 'edit') {
      return res.send('edit template')
    } //allpro send all products instead use a fetch router
    return res.render('dashboard.ejs', { info: 'Dashboard', isAuthenticated: isAuth, allpro: products, BASEURL })
  } catch (err) {
    console.log(`err`, err)
  }
})

// router edit and delete verifyJWT
app.get('/dashboard/edit/:id', verifyJWT, async (req, res) => {
  const userId = req.query.userId // Retrieve userId from query parameters
  // leverage if return userid == loggin
  const isAuth = req.userId ? true : false

  const { id } = req.params

  const allcats = await categories()
  res.render('editPost.ejs', { info: 'Dashboard', isAuthenticated: isAuth, id: id, allcats, BASEURL })

  //return res.render('createPost.ejs', { info: 'Dashboard', isAuthenticated: isAuth } );
})

app.get('/dashboard/delete/:id', (req, res) => {
  const { id } = req.params

  res.render('deletePost.ejs', { info: 'Dashboard', isAuthenticated: isAuth, id: id })
})

/* === PAGINA DO PRODUTO === */
app.get('/products/post/:id', isAuth, (req, res, next) => {
  const { id, slug } = req.params
  const product = products.find((product) => product.id === id && product.published)

  if (!product) {
    // maybe visite same single and return a 404 status
    // or create a 404 page
    return res.render('404.ejs', { isAuthenticated: isAuth })
  }
  return res.render('single.ejs', { product, auth: req.isAuthenticated })
})

app.get('/products', (req, res) => {
  //filter
  const published = products.filter((post) => post.published === true)

  // chooice what send to client
  const sendPosts = published
    ?.map(({ id, name, price, bodyContent, category }) => {
      return {
        id,
        name,
        price,
        bodyContent,
        category,
      }
    })
    .reverse()

  return res.json(sendPosts)
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  ///console.log(`is a admin request`)
  const product = products.find((product) => product.id === id && product.published)

  if (!product) {
    // added res.status.. fix the Cannot set headers after they are sent to the client
    res.status(404).send('Content not found')
  }

  return res.json(product)

  // if you return this file as template, will broken single router json
  //return res.render("single.ejs", {product});
})

app.get('/products/search/category/?', async (req, res) => {
  // /products/search/category?q=android
  const isAuth = req.userId ? true : false
  const { q } = req.query

  if (q) {
    const postsByCategory = products.filter((post) => post.category.toLowerCase() === q.toLowerCase() && post.published)

    return res.render('category.ejs', { currentCategory: q, postsByCategory, isAuthenticated: isAuth })
  }
  // como o cadastro de posts é by form, nao tem risco de ter category duplicado, just return all categories
  const allcats = await categories()
  return res.render('categories.ejs', { isAuthenticated: isAuth, allcats })
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

/* === POST ROUTER === */
app.post('/products', verifyJWT, (req, res) => {
  let { name, price, bodyContent, published, category } = req.body

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
    category,
  }

  products.push(product)

  productFile()

  //return res.json(product)
  // essa messageos optional?
  return res.status(201).json({ message: 'Product created successfully', product: product })
})

/* === PUT ROUTER === */
app.put('/products/:id', verifyJWT, (req, res) => {
  const { id } = req.params
  const { name, price, bodyContent, published, category } = req.body

  const productIndex = products.findIndex((product) => product.id === id)

  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
    bodyContent,
    published,
    category,
  }

  productFile()

  return res.status(201).send({ message: 'Your product has been updated successfully!' })
})

/* === DELETE ROUTER === */
app.delete('/products/:id', verifyJWT, (req, res) => {
  const { id } = req.params

  const productIndex = products.findIndex((product) => product.id === id)

  products.splice(productIndex, 1)

  productFile()

  //return res.json({ message: 'produto removido com sucesso!' })
  return res.status(200).send({ message: 'Product deleted successfully' })
})

/* === ROTA PARA TESTES === */
// example multiple params and optional router
app.get('/movies/:id?/:value?', movies)

/* === STATUS DO SERVIDOR === */
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

const helloMiddleware = () => {
  return (req, res, next) => {
    console.log('Hello from custom middleware!')
    next() // Call next to move to the next middleware or route handler
  }
}

/* === functions === */

function productFile() {
  fs.writeFile('./db/products.json', JSON.stringify(products), (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('writeFile 201')
    }
  })
}

app.listen(port, () => console.log('server listening on port: ' + port))
