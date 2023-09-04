const express = require("express");
const article = require("./../models/article");
const router=express.Router();
const Article= require('./../models/article')

// set up the routes
router.get('/new',(req,res)=>{
    res.render('articles/new',{article:new Article()});
});



router.get("/edit/:id",async (req, res) => {
    const article = await Article.findById(req.params.id);
	res.render("articles/edit", { article: article });
});

router.get('/:slug',async (req,res)=>{
    const article= await Article.findOne({slug : req.params.slug});
    !article && res.redirect("/");
    res.render('articles/show',{article:article});
});

router.delete('/:slug',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.slug);
    res.redirect('/');
});

router.put('/:id',async (req,res,next)=>{
    req.article = await Article.findById(req.params.id);
		next();
},saveArticleAndRedirect('edit'));

router.post('/',async (req,res,next)=>{
    req.article =new Article()
    next()
},saveArticleAndRedirect('new'));

function saveArticleAndRedirect(path){
   return async (req,res) =>{
    let article=req.article
    article.title=req.body.title
    article.description=req.body.description
    article.markdown=req.body.markdown
    try{
        article = await article.save();
        res.redirect(`/articles/${article.slug}`);
    }catch(err){
        console.log(err)
        res.render(`articles/${path}`,{article:article});
    }
    };
}
module.exports=router;