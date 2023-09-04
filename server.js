const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const debug = require('debug')('app:startup');
const articleRouter = require('./routes/articles.js');
const Article =require('./models/article');
const methodOverride = require('method-override');
// initialize app
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
dotenv.config();

// set view engine
app.set('view engine','ejs');

mongoose.connect(process.env.MONGO_URL)
.then(()=>debug('Successfully connected to mongodb'))
.catch(err=>console.error(err.message));

mongoose.set('strictQuery', true);
// Link the routes to the files
app.use('/articles',articleRouter);


app.get("/",async (req, res) => {
    const articles = await Article.find().sort({createdAt:'desc'});

	res.render("articles/index",{articles});
});


const port=process.env.PORT || 7800;
app.listen(port,()=>debug(`Server started and listening on http://127.0.0.1:${port}`));
