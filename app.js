const express = require("express");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const app = express();
const port = 3000;
const dbURL = "mongodb+srv://satheeshkumar:Asdf@123@cluster0.hhrvu.mongodb.net/test";
app.use(express.json());


//create a mentor 
app.post("/create-mentor", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("mentor_assign_db");
    let result = await db.collection("mentors").insertOne(req.body);
    res.status(200).json({ message: "mentor created" });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// create a student 
app.post("/create-student", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("mentor_assign_db");
    let result = db.collection("students").insertOne(req.body);
    res.status(200).json({ message: "students created" });
    client.close();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// assign a mentor
app.put("/assign-mentor", async (req, res) => {
  try {
      let client = await mongoClient.connect(dbURL);
      console.log(req.body.name)
      let db = client.db("mentor_assign_db");
      await db
          .collection("students")
          .updateMany(
              { name:  req.body.name },  //student_name
              { $set: { mentorName: req.body.mentorName } }
          );    
      let result = await db
          .collection("students")
          .find( )
          .toArray();
      res.status(200).json({ message: "mentor assigned", result });
      client.close();
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});


// assign a student -- not necessary
app.put("/assign-student", async (req, res) => {
  try {
      let client = await mongoClient.connect(dbURL);
      let db = client.db("mentor_assign_db");
      let result = await db
          .collection("students")
          .updateOne(
              {mentorName: req.body.mentorName },
              { $set: { name:  req.body.name }}
          );
      res.status(200).json({
          message: "mentor assigned or changed to a particular student"
      });
      client.close();
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

// read students list
app.get("/students-list", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("mentor_assign_db");
    let result = await db.collection("students").find().toArray();
    res.status(200).json({ message: " student list", result });
    client.close();
    // console.log("atlas")
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Individual students fetch
app.get("/student/:id",async(req,res)=>{
  const objid = mongodb.ObjectID(req.params.id);
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("mentor_assign_db");
    let result = await db.collection("students").findOne({_id:objid})
    res.status(200).json({ message: "Individual student", result });
    client.close(); 
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// read mentors list 
app.get("/mentors-list", async (req, res) => {
    try {
      let client = await mongoClient.connect(dbURL);
      let db = client.db("mentor_assign_db");
      let result = await db.collection("mentors").find().toArray();
      res.status(200).json({ message: " mentors list", result });
      client.close();
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

// Individual Mentor fetch
app.get("/mentor/:id",async(req,res)=>{
  const objid = mongodb.ObjectID(req.params.id);
  try {
    let client = await mongoClient.connect(dbURL);
    let db = client.db("mentor_assign_db");
    let result = await db.collection("mentors").findOne({_id:objid})
    res.status(200).json({ message: "Individual mentor", result });
    client.close(); 
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// delete Student
app.delete("/deletestudent/:id", async(req,res) => {
    const objid = mongodb.ObjectID(req.params.id);
    try {
        let client = await mongoClient.connect(dbURL);
        let db = client.db("mentor_assign_db");
    let result = await db.collection("students").findOneAndDelete({_id:objid})
    res.status(200).json({ message: "Student deleted" });
    client.close(); 
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// delete mentor
app.delete("/deletementor/:id", async(req,res) => {
    const objid = mongodb.ObjectID(req.params.id);
    try {
        let client = await mongoClient.connect(dbURL);
        let db = client.db("mentor_assign_db");
    let result = await db.collection("mentors").findOneAndDelete({_id:objid})
    res.status(200).json({ message: "Mentor deleted" });
    client.close(); 
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


  // students without mentor
  app.get("/idle-students", async (req, res) => {
    try {
        let client = await mongoClient.connect(dbURL);
        let db = client.db("mentor_assign_db");
        let result = await db
            .collection("students")
            .find({ mentorName: null })
            .toArray();
        res.status(200).json({
            message: "list of students without a mentor",
            result
        });
        client.close();
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// students under mentor
app.get("/students-under-mentor/:mentorName", async (req, res) => {
  try {
      let client = await mongoClient.connect(dbURL);
      let db = client.db("mentor_assign_db");
      let result = await db
          .collection("students")
          .find({mentorName: req.params.mentorName})
          .toArray();
      res.status(200).json({
          message: `students under mentor_name: `,
          result  
      });
      client.close();
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log("server started at " + port);
});