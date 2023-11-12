const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const otpGenerator = require('otp-generator');
const mailer = require("../utils/mailer");
const {User,Otp} = require("../models");
const { ErrorHandler } = require('../middleware/errors');
const jv = require("../utils/validation");

module.exports = {
    login : async (req, res, next) => {
        try{
            const body = await jv.loginSchema.validateAsync(req.body);

            const email = body.email.toLowerCase();
            const password = body.password;

            const user = await User.findOne({ email });
            if (!user) 
                return next(new ErrorHandler(404,"User Not Found"));

            const result = await bcrypt.compare(password, user.password);
            if (!result) return next(new ErrorHandler(400,"Invalid Credentials"));
            
            const token = jwt.sign({
                id: user._id,
            }, process.env.JWT_ACCESS_KEY, { expiresIn: '1d' });

            const data = {
                token,
                user
            }

            return res.status(200).json({success:true, message:"Logged In Successfully",data});
        }catch(err){
            next(err);
        }
    },
    email : async (req,res,next) => {
            try {
            const body = await jv.emailSchema.validateAsync(req.body);
            
            const email = body.email.toLowerCase();

            const oldUser = await User.findOne({
                email:email.toLowerCase()
            });

            if(oldUser)
                return next(new ErrorHandler(400,"User by this email already exists."));

            const mailedOTP = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false
            });

            mailer.sendmail(email,mailedOTP);
            
            const oldotp = await Otp.findOne({email});

            if(oldotp){
                let dateNow = new Date();
                dateNow = dateNow.getTime()/1000;
                let otpDate = new Date(oldotp.updatedAt);
                otpDate = otpDate.getTime()/1000;

                if(dateNow<otpDate+10)
                    return next(new ErrorHandler(400,"Wait for 10 seconds to resend mail."));
                oldotp.otp = mailedOTP;
                oldotp.save();
            }else{
                Otp.create({
                    email:email.toLowerCase(),
                    otp : mailedOTP
                });
            }
            return res.status(200).json({success:true,message:`OTP sent on ${email}`});
        } catch (err) {
            next(err);
        }
    },
    signup : async (req,res,next) => {
        try {
            let body = await jv.signupSchema.validateAsync(req.body);

            const {name,password,otp} = body;
            const email = body.email.toLowerCase();

            const otpdb = await Otp.findOne({email});
            
            if(!otpdb)
                return next(new ErrorHandler(400,"Otp for this mail expired resend otp"));
            
            if(otpdb.used)
                return next(new ErrorHandler(400,"Otp already used"));

            if(otpdb.otp!=otp)
                return next(new ErrorHandler(400,"Wrong Otp entered"));
            
            const encryptedPassword = await bcrypt.hash(password, 12);

            const newuser = await User.create({
                name,
                email,
                password:encryptedPassword
            })

            otpdb.used = true;
            otpdb.save();

            const token = jwt.sign({
                id: newuser._id,
            }, process.env.JWT_ACCESS_KEY, { expiresIn: '1d' });

            const data = {
                token,
                user: newuser
            }
            return res.status(201).json({success:true,message:"Signed Up Successfully",data})
        } catch (err) {
                next(err);
        }
    }
}