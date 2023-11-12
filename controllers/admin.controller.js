

module.exports = {
    createNewAdmin : async (req,res,next) => {
        try {
            const {uname,password} = req.body;
            if(!uname||!password)
                return next(new ErrorHandler(406,"All input fields required -> uname,password"))
            const encryptedPassword = await bcrypt.hash(password, 12);
            const admin = await Admin.create({
                uname,
                password:encryptedPassword
            });
            if(admin)
                return res.status(200).json({success:true,msg:`Admin created : ${admin.uname}`});
        } catch (err) {
            return next(err);
        }
    }
}