const User=require('../models/user');
const bcrypt=require('bcryptjs')
const validator=require('validator');
module.exports = {
    createdUser: async function({userInput},req){
        const errors=[];
       // console.log(userInput)
        if(!validator.isEmail(userInput.email)){
           // console.log('email error')
            errors.push({message:'email is invaid'})
        }
        if(validator.isEmpty(userInput.password)|| !validator.isLength(userInput.password,{min:5})){
            errors.push({message:'password should be of minimum 5 char long'})
        }
        if(errors.length>0){
            const error=new Error('Invalid input');
            error.data=errors;
            error.code=422;
            throw error;
        }
        const existingUser=await User.findOne({email:userInput.email});
       // console.log(existingUser._doc)
        if(existingUser){
            console.log('existing')
            const error=new Error('user Already exist');
            throw error;
        }
        const hashedPw=await bcrypt.hash(userInput.password,12);
        const user=new User({
            email:userInput.email,
            name:userInput.name,
            password:hashedPw
        })

        const createdUser=await user.save();

        return {...createdUser._doc,_id:createdUser._id.toString()}

    }
    
}
// module.exports={
//     hello(){
//         return{
//             text:'Hello GraphQL',
//             views:12345 
//         }
//     }
// }