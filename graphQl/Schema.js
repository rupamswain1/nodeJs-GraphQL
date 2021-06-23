const {buildSchema}=require('graphql');

module.exports = buildSchema(` 
    type Post{
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
        name:String!
        email:String!
        password:String,
        status:String!
        posts:[Post!]!

    }

    input UserInputData{
        email:String!
        name:String!
        password:String!
    }

    type RootQuery{
        hello:String
    }
    
    type RootMutation{
        createdUser(userInput:UserInputData):User!
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }
`)