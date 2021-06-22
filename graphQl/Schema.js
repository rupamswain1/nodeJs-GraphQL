const {buildSchema}=require('graphql');

module.exports = buildSchema(` 
    tyope:Post{
        _id:ID!
        title:String!
        content:String!
        imageUrl:String!
        creator:User!
        createdAt:String,
        updatedA:String
    }
    type User{
        _id:ID!
        name?:String!
        email:String!
        password:String,
        status:String!
        posts:[]

    }
`)