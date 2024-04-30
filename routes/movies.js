import { categories } from '../utils/getCategories.js'

export function movies(req, res) {
  // example multiple params and optional router
  const getparams = req.params


  let data = ''
  categories()
    .then((category) => {
      data = category
      return renderMovies(data)
    })
    .catch((err) => {
      console.error(err) // Handle errors
    })

  // Access the category and id parameters
  // Perform operations based on the parameters
  // return res.render('movie.ejs', {getparams})

  function renderMovies(data){
    res.render('movie.ejs', { getparams, current: process.env.BASEURL, envobj: process.env, categories: data })
  }
}
