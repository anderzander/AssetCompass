const jwt = require("jsonwebtoken");
ACCESS_TOKEN_SECRET = "44dbe68839452adf16731a51a9b4d758b47eb97264459639d1f8910c4177e7bfe0404857f20fb408401ee8ba11c5665f3723f5111a6762c1a5522ff4383ec4ed"
REFRESH_TOKEN_SECRET = "9355a325a38e0b51a41d918599b2959a1b8493aaba9fd0dccee6245fc2c14dbed4d2d9c1c0232dd1ff42869b712530b867b664e896434aaa95dd7434e62af74d"


function authenticateToken(req, res, next) {
    const token = req.cookies.token
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }

        console.log(user.name)
        req.user = user
        next()
    })
}



module.exports = {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, authenticateToken};