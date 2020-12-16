var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var path = require('path');
var bodyParser = require("body-parser");
var logged = false;
var users = [
    { id: 0, login: "AAA", password: "PASS1", age: 10, student: undefined, gender: "m" },
    { id: 1, login: "q", password: "PASS1", age: 20, student: undefined, gender: "f" },
    { id: 2, login: "w", password: "PASS1", age: 15, student: "yes", gender: "m" },
    { id: 3, login: "e", password: "PASS1", age: 13, student: "yes", gender: "f" },
    { id: 4, login: "r", password: "PASS1", age: 11, student: "yes", gender: "m" },
    { id: 5, login: "t", password: "PASS1", age: 10, student: undefined, gender: "f" },
    { id: 6, login: "y", password: "PASS1", age: 19, student: undefined, gender: "m" },
    { id: 7, login: "u", password: "PASS1", age: 12, student: "yes", gender: "f" },
    { id: 8, login: "i", password: "PASS1", age: 14, student: "yes", gender: "m" },
    { id: 9, login: "o", password: "PASS1", age: 11, student: undefined, gender: "f" },
    { id: 10, login: "p", password: "PASS1", age: 17, student: "yes", gender: "m" },
    { id: 11, login: "a", password: "PASS1", age: 20, student: "yes", gender: "f" },
    { id: 12, login: "b", password: "PASS1", age: 13, student: undefined, gender: "m" },
]
var id = users.length

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/static/pages/main.html"))
})

app.get("/main", function(req, res){
    res.sendFile(path.join(__dirname + "/static/pages/main.html"))
})

app.get("/login", function(req, res){
    res.sendFile(path.join(__dirname + "/static/pages/login.html"))
})

app.get("/register", function(req, res){
    res.sendFile(path.join(__dirname + "/static/pages/register.html"))
})

app.get("/admin", function(req, res){
    if(logged){res.sendFile(path.join(__dirname + "/static/pages/admin.html"))}
    else{res.sendFile(path.join(__dirname + "/static/pages/adminNL.html"))}
})
app.get("/admin.html", function(req, res){
    if(logged){res.sendFile(path.join(__dirname + "/static/pages/admin.html"))}
    else{res.sendFile(path.join(__dirname + "/static/pages/adminNL.html"))}
})

app.get("/logout", function(req, res){
    logged = false;
    res.send("Zakończono sesję. <a href='login'>Zaloguj się ponownie.</a>")
})

app.post("/registerHandleForm", function(req, res){
    let exist = false;
    users.forEach(user => {if (req.body.login == user.login) {exist = true;}});
    if(exist){res.send("Taki użytkownik już istnieje. <a href='register'>Spróbuj ponownie.</a>")}
    else{
        users.push({ id: id, login: req.body.login, password: req.body.password, age: req.body.age, student: req.body.student, gender: req.body.gender })
        id += 1;
        console.log(users)
        res.send(`Użytkownik ${req.body.login} zarejestrowany poprawnie. <a href='login'>Zaloguj się.</a>`)
    }
})

app.post("/loginHandleForm", function(req, res){
    users.forEach(user => {
        if(user.login == req.body.login){
            if(user.password == req.body.password){
                logged = true
                res.sendFile(path.join(__dirname + "/static/pages/admin.html"))
            }
        }
    });
    if(!logged){res.send("Nieprawidłowy login lub hasło. <a href='login'>Spróbuj ponownie.</a>")}
})

app.get('/sort', function (req, res) {
    if (logged) {
        let sorted = [];
        users.forEach(user => { sorted.push(user); })
        let page = `<head><title>admin panel</title><link rel='stylesheet' href='css/style.css'></head><body><div class="nav-sort"><a href="sort" class="nav-link">sort</a><a href="gender" class="nav-link">gender</a><a href="show" class="nav-link">show</a></div><form class="sort" action="/sortHandleForm" method="GET" onchange="this.submit()"><input type="radio" name="sort" value="rosnaco"><label for="sort">rosnaco</label><input type="radio" name="sort" value="malejaco"><label for="sort">malejaco</label></form><table>`;
        sorted.forEach(user => {
            if(user.student == 'yes'){page += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td><td>student: <input type="checkbox"checked disabled></td><td>age: ${user.age}</td><td>gender: ${(user.gender == 'f') ? 'k' : 'm'}</td></tr>`;}
            else{page += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td><td>student: <input type="checkbox" disabled></td><td>age: ${user.age}</td><td>gender: ${(user.gender == 'f') ? 'k' : 'm'}</td></tr>`;}
        });
        page += "</table></body>";
        res.send(page);
    }
    else{res.sendFile(path.join(__dirname + "/static/pages/adminNL.html"))}
});

app.get("/sortHandleForm", function (req, res) {
    let sort = req.query.sort;
    let sorted = [];
    users.forEach(user => { sorted.push(user); })
    if (sort == 'malejaco') {
        sorted.sort(function (a, b) {
            return parseFloat(b.age) - parseFloat(a.age);
        });
    } else {
        sorted.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });
    }
    let page = `<head><title>admin panel</title><link rel='stylesheet' href='css/style.css'></head><body><div class="nav-sort"><a href="sort" class="nav-link">sort</a><a href="gender" class="nav-link">gender</a><a href="show" class="nav-link">show</a></div><form class="sort" action="/sortHandleForm" method="GET" onchange="this.submit()"><input type="radio" name="sort" ${(sort == 'rosnaco') ? 'checked = "checked"' : false} value="rosnaco"><label for="sort">rosnaco</label><input type="radio" name="sort" ${(sort == 'malejaco') ? 'checked = "checked"' : false} value="malejaco"><label for="sort">malejaco</label></form><table>`;
    sorted.forEach(user => {
        page += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td><td>student: ${(user.student == 'checked') ? '<input type="checkbox"checked disabled>' : '<input type="checkbox" disabled>'}</td><td>age: ${user.age}</td><td>gender: ${(user.gender == 'f') ? 'k' : 'm'}</td></tr>`;});
    page += "</table></body>";
    res.send(page);
});

app.get('/gender', function (req, res) {
    if (logged) {
        let page = `<head><title>admin panel</title><link rel='stylesheet' href='css/style.css'></head><body><div class="nav-sort"><a href="sort" class="nav-link">sort</a><a href="gender" class="nav-link">gender</a><a href="show" class="nav-link">show</a></div><table>`;
        let female = `<table class="gender">`;
        let male = `<table class="gender">`;
        users.forEach(user => {
            if (user.gender == 'f') {female += `<tr><td>id: ${user.id}</td><td>gender: f</td></tr>`;}
            else {male += `<tr><td>id: ${user.id}</td><td>gender: m</td></tr>`;}
        });
        female += "</table>"; male += "</table>"
        page += female + male + "</body>";
        res.send(page);
    }
    else{res.sendFile(path.join(__dirname + "/static/pages/adminNL.html"))}
});

app.get('/show', function (req, res) {
    if (logged) {
        let page = `<head><title>admin panel</title><link rel='stylesheet' href='css/style.css'></head><body><div class="nav-sort"><a href="sort" class="nav-link">sort</a><a href="gender" class="nav-link">gender</a><a href="show" class="nav-link">show</a></div><table>`;
        users.forEach(user => {
            page += `<tr><td>id: ${user.id}</td><td>user: ${user.login} - ${user.password}</td><td>student: ${(user.student == 'yes') ? '<input type="checkbox" checked disabled>' : '<input type="checkbox" disabled>'}</td><td>age: ${user.age}</td><td>gender: ${(user.gender == 'f') ? 'f' : 'm'}</td></tr>`;});
        page += "</table></body>";
        res.send(page);
    }
    else{res.sendFile(path.join(__dirname + "/static/pages/adminNL.html"))}
});

app.use(express.static('static'));

app.listen(PORT, function(){
    console.log("Start serwera na porcie " + PORT)
})