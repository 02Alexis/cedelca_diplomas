import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "No se encontro token"});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.userId = tokenDecode.id;
        } else {
            return res.json({success: false, message: "No se encontro token"});
        }
        next();
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

export default authUser;
