//   middleware to check if user is logged in 
const requireLogin = (req, res, next) => {
    if (req.session.logIn) {
        next();
    } else {
        // res.data-bs-target("#modelId")
        res.redirect('/login')
        // return res.status(400).json({message:'Login need for use this feacher'})
    }
}