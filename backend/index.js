import express from 'express'
import mongoose from "mongoose"
import cors from "cors"
import multer from 'multer'
import {EmployeeModel} from "./models/Employee.js"


const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://0.0.0.0:27017/employee").then(()=>{
    console.log("database has been connected successfuly")
}).catch((error)=>{
    console.log(error)
})

app.post("/login", (req, res) =>{
    const {email, password} = req.body;
    EmployeeModel.findOne({email: email})
    .then(user =>{
        if(user) {
            if(user.password === password){
                res.json("success")
            }else{
                res.json("the password is incorect")
            }
        } else{
            res.json("no record existed")
        }
    })
})


app.post("/register", (req, res) => {
    EmployeeModel.create(req.body)
    .then(employee => res.json(employee))
    .catch(error => res.json(error))
})




const blogImageLocation = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "blogImages")
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});


const uploadImage = multer({
    storage: blogImageLocation
})


// const EmployeeModel = require("./models/Employee.js");

app.post("/api/blog/create", uploadImage.single("blogImage"), async(req, res) => {

    try {

        const createBlog = blogModel({
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename
        })

        const saveData = await createBlog.save();

        res.send(saveData);

    }catch(error){
        console.log(error)
    }

})



app.use("/blogImages", express.static("blogImages"))

//displaying All Data 
app.get("/blogs", async (req, res) => {

    try {

        const blogData = await EmployeeModel.find();
        res.send(blogData)

    }catch(error){
        console.log(error)
    }
})


app.get("/blog/:id", async (req, res) => {

    try {

        const blogOne = await EmployeeModel.findById({
            _id: req.params.id
        });

        res.send(blogOne)

    }catch(error){
        console.log(error)
    }
})




app.listen(3001, () => {
    console.log("server is runing");
})