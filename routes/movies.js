export function movies(req, res) {
  // example multiple params and optional router
  
    const product = req.params

    console.log(product)
    // Access the category and id parameters
    // Perform operations based on the parameters
    // return res.render('movie.ejs', {product})

    return res.render('movie.ejs', { product, current: process.env.BASEURL, envobj: process.env })
  
}
