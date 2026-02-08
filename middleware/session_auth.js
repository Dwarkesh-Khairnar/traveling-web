// middleware/session_auth.js
const requireLogin = (req, res, next) => {
  if (req.session?.logIn) {
    return next();                 // user is logged in → continue
  }
  // not logged in → redirect to login page
  return res.redirect('/login');
};

export default requireLogin;
