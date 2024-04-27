import jwt from 'jsonwebtoken'

//função que verifica se o JWT é ok
export function verifyJWT(req, res, next) {
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