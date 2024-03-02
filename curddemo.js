const express = require("express")
const { MongoClient } = require("mongodb"); // predefined package

const app = express()
app.use(express.json()) // to pare JSON data

const dburl = "mongodb://localhost:27017"

const dbname = "restdemo14"

const client = new MongoClient(dburl) // to assign the connection to the mongo client

client.connect().then(() => {
    console.log("Connected to the database successfully!")
}).catch((err) => {
    console.log(err.message)
});

const db = client.db(dbname)
app.post("/addstudent/" , async (request,response)=>{ // to wait for the response       
    try {
        const s = await request.body
        db.collection("student").insertOne(s)
        response.send("Student inserted successfully !")
    }
    catch(e)
    {
        // console.log(e.message)
        response.status(500).send(e.message)
    }

})

app.get("/viewstudents", async (request,response)=>{
    try{
       const students =  await db.collection("student").find().toArray()
       if(students.length===0)
       {
        response.send("EMPTY STUDENT COLLECTION")
       }
       else
       {
       response.json(students)
       } // we are sending jason as respone so we cant use the .send()
    }
    catch(e){
        response.status(500).send(e.message)
    }
})

app.delete("/deletestudent/:id",async (request,response)=>{
  try
  {
      const id=await request.params.id
      const id1=parseInt(id)
      const student=db.collection("student").findOne({"sid":id1})
      if(student!=null)
      {
          db.collection("student").deleteOne({sid:id1})
      response.send("Student Deleted Successfully")
      }
      else
      {
          response.send("Student ID is not found")
      }
      
  }
  catch(e)
  {
      //console.log(e.message)
      response.status(500).send(e.message)
  }

})

app.get("/studentbyid/:id" , async (request, response)=>{ //http://localhost:2014/deletestudent/101 ga istamu manam
    try{
       const id = await request.params.id  
       const s = await db.collection("student").findOne({sid:parseInt(id)})
       response.json(s)
    }
    catch(e){
        console.log(e.message)
    }
})

app.put("/updatestudent", async (request, response) => {
    try 
    {
      const s = await request.body;
      const student = await db.collection("student").findOne({ sid: parseInt(s.sid) });
  
      if (student !== null)
      {
        await db.collection("student").updateOne({ sid: s.sid }, { $set: { "sname": s.sname, "sage": s.sage } });
        response.send("Student Updated Successfully!");
      } else {
        response.send("Student Id NOT FOUND");
      }
    } catch (e)
    {
       response.status(500).send(e.message)
    }
  });
  




const port = 2014
app.listen(port,()=>{
    console.log("Server is running at port: "+port)
})

// /deletestudent/løl [without param name]
// /de1etestudent?id=1Ø1 [with param name]
// /de1etestudent?id=1Ø1&name=surya [more than one param name]