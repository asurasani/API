const express = require("express");
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser.json());

let patients = new Object();
patients["999991234"] = ["Jensen","Watkins", "425-555-1234"]
patients["999995678"] = ["Patrick","Mahomes", "425-555-5678"]

let records = new Object();
records["999991234"] = "Status: Healthy"
records["999995678"] = "Status: Comma"

//Get patient medical records
app.get("/records", (req, res) =>{

    //verify patient exists
    if(records[req.headers.ssn] === undefined){
        res.status(404).send({"msg": "Patient not found"})
        return;
    }
    
    //verify ssn matches first and last name
    if(req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]){
        if(req.body.reasonforvisit === "medicalrecords"){
            res.status(200).send(records[req.headers.ssn]);
            return;
        }
        else{
            res.status(501).send({"msg":"Unable to complete requests at this time: " + req.body.reasonforvisit})
            return;
        }
    }
    else{
        res.status(401).send({"msg": "First or Last did not match SSN"})
        return;
    }

    //return appropriate record
});

// Create a new patient
app.post("/", (req, res) =>{
    patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.headers.phonenumber]
    res.status(200).send(patients)
});

// Update existing patient phone number
app.put("/", (req, res) =>{
    if(records[req.headers.ssn] === undefined){
        res.status(404).send({"msg": "Patient not found"})
        return;
    }

    if(req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]){
        //update phone number and return patient info
        patients[req.headers.ssn] = [req.headers.firstname, req.headers.lastname, req.body.phonenumber]
        res.status(200).send(patients[req.headers.ssn])
        return;
    }
    else{
        res.status(401).send({"msg": "First or Last did not match SSN"})
        return;
    }
});

//Delete a patient and records
app.delete("/", (req, res) =>{

    if(records[req.headers.ssn] === undefined){
        res.status(404).send({"msg": "Patient not found"})
        return;
    }

    if(req.headers.firstname == patients[req.headers.ssn][0] && req.headers.lastname == patients[req.headers.ssn][1]){
        //delete patient from and medical records from database

        delete patients[req.headers.ssn]
        delete records[req.headers.ssn]

        res.status(209).send({"msg": "Successfully deleted"})
        return;
    }
    else{
        res.status(401).send({"msg": "First or Last did not match SSN"})
        return;
    }
});

app.listen(3000);