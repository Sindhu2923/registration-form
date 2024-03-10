
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

dotenv.config();

const port = process.env.PORT || 3000 ;

const username = process.env.MONGODB_USERNAME ;
const password = process.env.MONGODB_PASSWORD ;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.x984kjk.mongodb.net/registrationFormDB`,{
    useNewUrlParser  : true ,
    useUnifiedTopology : true 
})

const registerationschema = new mongoose.Schema({
    name : String ,
    email : String ,
    password : String 
})

const Registeration = mongoose.model("Registeration" , registerationschema);
app.use(bodyparser.urlencoded({ extended : true }));
app.use(bodyparser.json());
 

app.get("/", (req,res) => {
    res.sendFile( path.join(__dirname,"pages","index.html") );
})

app.get("/success" , (req,res) => {
    res.sendFile( path.join(__dirname ,"pages" ,"success.html"))
})

app.get("/error" , (req,res) => {
    res.sendFile( path.join(__dirname,"pages","error.html"))
})


app.post("/register" , async(req,res) => {

    try{
        const { name ,email ,password } = req.body;


        const data = await Registeration.findOne({email:email});

        if(!data){

            const registerationdata = new Registeration({
                name,
                email,
                password
            })
            await registerationdata.save();

        res.redirect("/success");
           
        }
        else{
            console.log("User already exists");
            res.redirect("/error")
        }
        
        

    }
    catch(error){
        console.log(error);
        res.redirect("error");

    }
})


app.listen( port , () => {
    console.log(`server is runnig on port ${port}`);
} )