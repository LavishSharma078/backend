const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
require('./config/passport')(passport);

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

dotenv.config();

var corsOptions = {
    origin: '*',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions))
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.get('/',(req,res)=>{
    res.json("Server running fine")
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
