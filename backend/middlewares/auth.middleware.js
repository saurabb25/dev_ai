import jwt from "jsonwebtoken"
// import redisClient from "../services/redis.service"

export const authMiddleware = async(req, res, next) => {
    const token = req.headers.authorization

    if(!token){
        res.status(401).json({message: "Unauthorized User"})
    }

    // const isBlacklisted = await redisClient.get(token)

    // if(isBlacklisted){
    //     res.redirect('/user/login')
    // }

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.redirect('/user/login')
            } else {
                req.user = decodedToken
                next()
            }
        })
    } else {
        res.redirect('/user/login')
    }
}
