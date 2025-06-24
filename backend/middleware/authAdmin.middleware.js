import jwt from 'jsonwebtoken'

// admin authentication middleware
export const authAdmin = async (req, res, next) => {
    try {
        const { admintoken } = req.headers

        if (!admintoken) {
            return res.json({
                success: false,
                message: "Not Authorized, Try again!"
            })
        }

        const token_decode = jwt.verify(admintoken, process.env.JWT_SECRET)

        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({
                success: false,
                message: "Token not Authorized!, Try Again"
            })
        }

        next()
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: err.message
        })
    }
}