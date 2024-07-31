const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const client = require('prom-client');
const Register = require('./models/registermodel');

const app = express();
const port = 3003;

// Database connection
// mongoose.connect('mongodb://127.0.0.1:27017/Demo', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to database'))
//     .catch((err) => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const counter = new client.Counter({
    name: 'type_counter',
    help: 'Any arbitrary value to help identify this counter',
});

const gauge = new client.Gauge({
    name: 'type_gauge',
    help: 'Any arbitrary value to help identify this gauge',
});

const histogram = new client.Histogram({
    name: 'type_histogram',
    help: 'Any arbitrary value to help identify this histogram',
});

const summary = new client.Summary({
    name: 'type_summary',
    help: 'Any arbitrary value to help identify this summary',
});

const metrics = {
    counter,
    gauge,
    histogram,
    summary
};

const handleCounterIncrement = (req, res) => {
    metrics.counter.inc();
    res.send({ message: 'Success' });
};

const handleCounterReset = (req, res) => {
    metrics.counter.reset();
    res.send({ message: 'Success' });
};

const handleGaugeIncrement = (req, res) => {
    metrics.gauge.inc();
    res.send({ message: 'Success' });
};

const handleGaugeDecrement = (req, res) => {
    metrics.gauge.dec();
    res.send({ message: 'Success' });
};

const handleGaugeSetValue = (req, res) => {
    metrics.gauge.set(req.params.value);
    res.send({ message: 'Success' });
};

const handleHistogramValue = (req, res) => {
    metrics.histogram.observe(req.params.value);
    res.send({ message: 'Success' });
};

const handleSummaryValue = (req, res) => {
    metrics.summary.observe(req.params.value);
    res.send({ message: 'Success' });
};

// Define routes for metrics
const metricsRouter = express.Router();
metricsRouter.get('/counter/inc', handleCounterIncrement);
metricsRouter.get('/counter/reset', handleCounterReset);
metricsRouter.get('/gauge/inc', handleGaugeIncrement);
metricsRouter.get('/gauge/dec', handleGaugeDecrement);
metricsRouter.get('/gauge/set/:value', handleGaugeSetValue);
metricsRouter.get('/histogram/:value', handleHistogramValue);
metricsRouter.get('/summary/:value', handleSummaryValue);

// Use the router for Prometheus metrics routes
app.use('/prom', metricsRouter);

// Metrics endpoint
app.use('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', client.register.contentType);
        res.end(await client.register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
    console.log('req.body');
});

// app.post('/register', upload.single('profilePic'), (req, res) => {
//     const user = new Register({
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         profilePic: req.file.path,
//         password: req.body.password
//     });
//     user.save()
//         .then(() => {
//             res.redirect('/success');
//             console.log('Data saved to database');
//         })
//         .catch((err) => {
//             res.status(400).send('Data not saved to database');
//             console.log('Data not saved to database');
//         });
// });

// app.get('/register', async (req, res) => {
//     try {
//         const users = await Register.find();
//         res.send(users);
//     } catch (err) {
//         res.send('Error' + err);
//     }
// });

// app.get('/register/:id', async (req, res) => {
//     try {
//         const user = await Register.findById(req.params.id);
//         res.send(user);
//     } catch (err) {
//         res.send('Error' + err);
//     }
// });

// app.put('/register/:id', async (req, res) => {
//     try {
//         const user = await Register.findById(req.params.id);
//         user.name = req.body.name;
//         user.email = req.body.email;
//         user.phone = req.body.phone;
//         user.profilePic = req.body.profilePic;
//         user.password = req.body.password;
//         const a1 = await user.save();
//         res.send(a1);
//     } catch (err) {
//         res.send('Error' + err);
//     }
// });

// app.delete('/register/:id', async (req, res) => {
//     try {
//         const user = await Register.findById(req.params.id);
//         const a1 = await user.remove();
//         res.send(a1);
//     } catch (err) {
//         res.send('Error' + err);
//     }
// });

// Start the server
app.listen(port, () => {
    console.log(App is running on port ${port}!);
});
