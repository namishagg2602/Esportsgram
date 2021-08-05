const express=require("express");
/*const https=require("https");  // It is a native node module to get http request */
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();




//        MONGOOSE     CONNECTION     STARTED

mongoose.connect("mongodb://localhost:27017/esportsgram", {useNewUrlParser: true, useUnifiedTopology: true}); // connection with database

const credSchema = new mongoose.Schema({
    name : { 
        type : String,
        required : true
    },
    eid : {
        type : String,
        required : true,
        lowercase : true,
    }, 
    password : {
        type : String,
        required : true,
      //  match : /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
        minlength : 8,
        maxlength : 16
        }
});   //  creating a schema for collection. 

const credentials = mongoose.model("credentials",credSchema); // forming a collection named credentials


/*
const creds= new credentials({
    name : "Abc Xyz",
    eid : "abc@xyz.com",
    password : "abcxyz@123"
});  // creating a new object to store in collection named credentials
//   creds.save()   ----> It is to store creds object in the databse 
*/

//              MONGOOSE       CONNECTION      DONE









//             SCHEMA     FOR     POSTS    START 

const postSchema=new mongoose.Schema(
    {
       username : {
           type : String,
           required : true
       }, 
       picname : {
           type : String,
           required : true  
       },
       game : {
           type : String,
           required : true
       },
       beaten : {
           type : Number,
           default : 0
       },
       notbeaten : {
           type : Number,
           default : 0
       }
    }
);


const postlists = mongoose.model("postlists",postSchema);

//         POST     SCHEMA    COMPLETED  









app.use(bodyParser.urlencoded({extended:true}));    // to use the elements passed through form
app.set('view engine', 'ejs');       // Used to include EJS module in project
app.use(express.static(__dirname + '/public'));





//var items=["eat","sleep","repeat"];
//var eid="";
var user="";







//       LOGIN       BEGIN

app.get("/", function(req,res)
{  
   res.render("login");
   console.log("Login Page");
});

app.post("/", function(req,res)
{
   const email=req.body.eid;
   // find user's name from database and store it in "user" 
   const pswd=req.body.pswd;
   var k=0;
 
    credentials.find({eid : email , password : pswd},(function(err,creden){     // looping through the collection
       if(err)
       {
           console.log(err);
       }
       else
       {
           creden.forEach(function(cred)
           {
               k=k+1;
               console.log("Credentials found !!!!!!!    ");
           });


            
            if(k==1)
            {
                user=creden.name;
                res.redirect("/home");
            }
            else
            {
                const obj={msg : "Credentials Not Found" };
                res.redirect("/error-page");
            }

       }
   }));
   
});


//         LOGIN ENDS














//        SIGNUP     BEGIN



app.get("/signup",function(req,res)
{
    res.render("signup");
    console.log("Signup Page");

});



app.post("/signup", function(req,res)
{
   var usernm=req.body.name;
   var id=req.body.usrname;
   var pswd=req.body.pswd;

   var k=0; 
   credentials.find({eid : id},(function(err,creden){     // looping through the collection
    if(err)
    {
        console.log("Error in connecting with the database");
    }
    else
    {
        creden.forEach(function(cred)
        {
           k=k+1;
        })

        if(k==1)
        {
            alert("This email ID already exists");
            res.render("signup");
        }
        else
        {
            const creds2 = new credentials({
                name : usernm,
                eid : id,
                password : pswd
                });
    
            creds2.save();   // ---> uncomment it when database connected
            res.redirect("/");
        }
    }
}));
  
});

//          SIGNUP        ENDS














//         HOME  PAGE          BEGIN


app.get("/home",function(req,res)
{
    const piclist=[];
    const namelist=[];
    const beat=[];
    const unbeat=[];
    const gamelist=[];
   
    console.log("HomePage");


    postlists.find(function(err,posts)
    {
        if(err)
        {
            console.log(err);
        }
        else
        { 
            var n=0;
            posts.forEach(function(post)
            {
                n=n+1;
                piclist.push(post.picname);
                namelist.push(post.username);
                gamelist.push(post.game);
                beat.push(post.beaten);
                unbeat.push(post.notbeaten);
            });

            console.log("no of entries= "+n);
        }
    });

    var obj={pics:piclist, names:namelist, beat:beat, unbeat:unbeat, games:gamelist};
    console.log(obj);
    res.render("home-page",obj);
       /*var today= new Date();
        var options={weekday:'long', day: 'numeric', month:'long'};
        var day=today.toLocaleString("en-US", options);

    var obj={day:day, itemlist: items};
    res.render("list",obj);    // Looks for file named list in views folder passes object to it
*/
});

app.post("/home",function(req,res)
{
    res.redirect("/new-post");
});

//             HOME   PAGE    END














//       NEW   POST      BEGIN


app.get("/new-post",function(req,res)
{
    res.render("new-post");
    console.log("New post page");
});


app.post("/new-post",function(req,res)
{
    const img=req.body.image;
    const gm=req.body.game;

    const post = new postlist({
        username : "namish",
        picname : img,
        game : gm,
        beaten : 0,
        notbeaten : 0
        });

    post.save();  

    res.redirect("/home");
});

//        NEW   POST   ENDS






//      ERROR     PAGE     STARTS

app.get("/error-page",function(req,res)
{
    res.render("error");
    console.log("Error page");
});

app.post("/error-page",function(req,res)
{

})




app.listen(3000,function()
{
    console.log("Server started at port 3000");
});