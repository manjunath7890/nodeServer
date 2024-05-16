// add atlas req along with url

const mongoose = require('mongoose');
// const db = process.env.db;
const db = "mongodb+srv://flyingfortress289:flyingfortress289@cluster0.zlhd1zd.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(db, {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true
    // useFindAndModify:false
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });