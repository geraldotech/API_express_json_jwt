export function movies(req, res) {
  // example multiple params and optional router
  const getparams = req.params

  console.log(getparams)

  // Access the category and id parameters
  // Perform operations based on the parameters
  // return res.render('movie.ejs', {getparams})

  return res.render('movie.ejs', { getparams, current: process.env.BASEURL, envobj: process.env })
}
