const express = require('express');
const app = express();
const con = require('./dbconn');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){

    res.sendFile("/index.html")
});

app.post('/insert-user', function(req,res){
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    var sql = `INSERT INTO user (name, email, password) VALUES ('${name}','${email}','${password}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });

    res.redirect("/views")
});


app.get('/views',(req,res)=>{
        con.query("SELECT * FROM user", function (err, result, fields) {
          if (err) throw err;
          res.render("read.ejs",{result});
        });


})



//delete
app.get("/delete-data", (req, res) => {
    const deleteData = "delete from user where id=?";
    con.query(deleteData, [req.query.id], (err, rows) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/views");
      }
    });
});

//passing data to update page
app.get("/update-data", (req, res) => {
    const updateData = "select * from  user where id=?";
    con.query(updateData, req.query.id, (err, eachRow) => {
      if (err) {
        res.send(err);
      } else {
        console.log(eachRow[0]);
        result = JSON.parse(JSON.stringify(eachRow[0]));  //in case if it dint work 
        res.render("edit.ejs", { data: eachRow[0] });
      }
    });
});

//final update
app.post("/update", (req, res) => {
    const id_data = req.body.hidden_id;
    const name_data = req.body.name;
    const email_data = req.body.email;
  
    console.log("id...", req.body.name, id_data);
  
    const updateQuery = "update user set name=?, email=? where id=?";
  
    con.query(
      updateQuery,
      [name_data, email_data, id_data],
      (err, rows) => {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/views");
        }
      }
    );
  });
app.listen(3000,()=>{
    console.log('Running port 3000');
})
