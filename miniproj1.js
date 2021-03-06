var express= require('express');
var app=express();
const MongoClient=require('mongodb').MongoClient;
//connecting server file for awt
let server=require('./server');
//let config=require('./config');
let middleware=require('./middleware');
//const reponse=require('express');
//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Database connection
const url='mongodb://127.0.0.1:27017';
const dbName='HospitalManagement';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});

//get hosp details
app.get('/hospitaldetails', middleware.checkToken,function(req, res) {
    console.log("Hospital details") ;
    var data=db.collection('HospitalDetails').find().toArray().then(result=>res.json(result));
});

//get ventilator details
 app.get('/ventilatordetails', middleware.checkToken,function(req, res) {
    console.log("Ventilator details") ;
    var data=db.collection('VentilatorDetails').find().toArray().then(result=>res.json(result));
 });

 //search ventilator details by status
 app.post('/searchventbydetails', middleware.checkToken,(req, res) => {
     var status=req.body.status;
     console.log(status);
     var ventilatordetails=db.collection('VentilatorDetails') .find({"status":status}).toArray().then(result=>res.json(result));
    // res.send(ventilatordetails)
 });

 //search ventilator details by hospital name
 app.post('/searchventbyname', middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    console.log(name);
    var ventilatordetails=db.collection('VentilatorDetails')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//get hospital details by name
app.post('/searchhospital', middleware.checkToken, (req, res) => {
    const name = req.query.name;
    console.log(name);
    const ventilatordeatils = db.collection('HospitalDetails')
        .find({ 'name': new RegExp(name, 'i') }).toArray().then(result => res.json(result));
});

//add ventilator
app.post('/addventilator', middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item={hId:hId,ventilatorId:ventilatorId,status:status,name:name};
    db.collection('VentilatorDetails')
    .insertOne(item).then(result=>res.json("item inserted"));
});

//delete ventilator
app.delete('/deleteventilator', middleware.checkToken,(req,res)=>{
    var ventilatorId=req.body.ventilatorId;
    db.collection('VentilatorDetails')
    .deleteOne({"ventilatorId":ventilatorId}).then(result=>res.json("item deleted"));
});

//update ventilator details
app.put('/updateventilator', middleware.checkToken,(req, res) => {
    var ventid={ventilatorId:req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection('VentilatorDetails')
    .updateOne(ventid,newvalues,function(err,result){
        res.json("1 doc updated");
        if(err) throw err;
    });
});
app.listen(1100);
