import jwt from 'jsonwebtoken'

// Check if the user is authenticated
// some pages no needs protection, but can need knows user is loggin


export function isAuth(req, res, next) {
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
