// cretae a server that extracts data from registration form and send it to the mongodb database

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

//import models
const Register = require('./models/registermodel');


const port = 3000;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Demo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to database'),
         app.listen(port, () => console.log(`App is running ${port}!`))
    ).catch((err) => console.log(err));

// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

// routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
    console.log('req.body');
});

//SUCCESSFULLY REGISTERED
app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/views/success.html');
    console.log(req.body);
});

app.post('/register', upload.single('profilePic'), (req, res) => {
    const user = new Register({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profilePic: req.file.path,
        password: req.body.password
    });
    user.save().then(() => {
        // res.send('Data saved to database');
        res.redirect('/success');
        console.log('Data saved to database');
    }).catch(() => {
        res.status(400).send('Data not saved to database');
        console.log('Data not saved to database');
    });
});

app.get('/register', async(req, res) => {
    try {
        const users = await Register.find();
        res.send(users);
    } catch (err) {
        res.send('Error' + err);
    }
});

app.get('/register/:id', async(req, res) => {
    try {
        const user = await Register.findById(req.params.id);
        res.send(user);
    } catch (err) {
        res.send('Error' + err);
    }
}
);

app.put('/register/:id', async(req, res) => {
    try {
        const user = await Register.findById(req.params.id);
        user.name = req.body.name;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.profilePic = req.body.profilePic;
        user.password = req.body.password;
        const a1 = await user.save();
        res.send(a1);
    } catch (err) {
        res.send('Error' + err);
    }
});


app.delete('/register/:id', async(req, res) => {
    try {
        const user = await Register.findById(req.params.id);
        const a1 = await user.remove();
        res.send(a1);
    } catch (err) {
        res.send('Error' + err);
    }
});





