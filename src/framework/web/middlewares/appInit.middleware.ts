import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as cookieParser from 'cookie-parser';

const jwtAuth = (req, res, next) => {
  const authorization = (req.headers.authorization ||
    req.headers.Authorization)

  if (authorization && !(req.url.includes('/token') && req.method === 'POST')) {
    const accessToken = authorization.split(' ')[1];
    console.log("accessToken - " + accessToken);
    jwt.verify(accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({});
      } else {
        res.locals.isAuth = true;
        res.locals.user_role = decoded.role;
        res.locals.userId = decoded.id;
        if (decoded.role == 5 || decoded.role == 6) {
          res.locals.isAdmin = true;
        } else {
          res.locals.isAdmin = false;
        }
        console.log("locals - " + JSON.stringify(res.locals));
        next();
      }
    })
  } else {
    res.locals.isAuth = false;
    res.locals.isAdmin = false;
    res.locals.userId = null;
    next();
  }
}

const appInit = [
  cors({ credentials: true, origin: true }),
  bodyParser.urlencoded({ extended: false }), // parse application/x-www-form-urlencoded
  bodyParser.json(),  // parse application/json
  cookieParser(),
  jwtAuth
]

export default appInit;