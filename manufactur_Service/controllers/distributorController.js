


exports.createDistributorTechenican = async (req, res) =>{
    try {
        const userId = req.user.userId;

        if(!userId){
            return res.status(200).json({
                sucess:false,
                message:"Please Provide UserId"
            })
        };

        const {} = req.body;


    } catch (error) {
        console.log(error,error.message)
    }
}