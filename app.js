const express=require('express');
const bodyParser=require('body-parser');
const feedRoutes=require('./routes/feed');
const authRoutes=require('./routes/auth')
const cors=require('cors')
const path=require('path');
const mongoose=require('mongoose');
const multer=require('multer');
const { Result } = require('express-validator');
const { graphqlHTTP }=require('express-graphql');
const app=express();0
const auth=require('./middleware/is-auth')
const graphQlSchema=require('./graphQl/Schema');
const graphQlResolver=require('./graphQl/resolver');
const fs=require('fs');

const fileStorage = multer.diskStorage({
    destination: './images/',
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      );
    },
  });
const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};

app.use(bodyParser.json());
app.use(cors())
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method==='OPTIONS'){
        return res.sendStatus(200)
    }
    next();
})
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));



app.use((error,req,res,next)=>{
    console.log(error);
    const status=error.statusCode || 500;
    const message=error.message;
    const data=error.data;
    res.status(status).json({message:message,data:data});
})

app.use(auth);

app.put('/post-image',(req,res,next)=>{
    if(!req.isAuth){
        throw new Error('Not authenticated!');
    }
    if(!req.file){
        return res.status(200).json({message:'No File Provided'});
    }
    if(req.body.data){
        clearImage(req.body.oldPath)
    }
    return res.status(201).json({message:'File stored',filePath:req.file.path})
})

app.use('/graphql',graphqlHTTP({
    schema:graphQlSchema,
    rootValue:graphQlResolver,
    graphiql:true,
    customFormatErrorFn(err){
        if(!err.originalError){
            return err;
        }
        const data=err.originalError.data;
        const message=err.message||'An Error Occured';
        const code=err.originalError.code||500;
        return {message:message,status:code,data:data}
    }
}))

mongoose.connect('mongodb+srv://rupam123:rupam123@nodecluster.plaky.mongodb.net/NodeGraphQL?retryWrites=true&w=majority')
.then(result=>{
    console.log('<<<<<<<<<<<<server is up and Running>>>>>>>>>>>>>>>>>>>>>>>>')
   app.listen(8000);
    
})
.catch(err=>console.log(err)) 

const clearImage=filePath=>{
    filePath=path.join(__dirname,'..',filePath);
    fs.unlink(filePath,err=>console.log(err));
}