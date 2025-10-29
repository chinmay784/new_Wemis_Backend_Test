// const jwt = require("jsonwebtoken");

// exports.authMiddelWere = async (req, res, next) => {
//     const token = req.header("Authorization");

//     if (!token) {
//         return res.status(400).json({
//             message: "Access Denide : No Token Provide "
//         })
//     }
//     try {
//         const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             sucess: false,
//             message: "Invalid Token",
//         })
//     }
// }


const jwt = require("jsonwebtoken");

exports.authMiddelWere = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader ) {
            return res.status(401).json({
                success: false,
                message: "Access Denied: No or invalid token provided",
            });
        }

        const token = authHeader
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        req.user = verified; // attach decoded user info
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
