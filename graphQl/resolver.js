const User=require('../models/user');
const bcrypt=require('bcryptjs')
module.exports = {
    createdUser: async function({userInput},req){
        console.log('creating user')
        const existingUser=User.findOne({email:userInput.email});
        if(existingUser){
            const error=new Error('user Already exist');
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