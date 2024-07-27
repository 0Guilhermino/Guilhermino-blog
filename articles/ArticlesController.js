const express = require('express');
const router = express.Router();

const Category = require('../categories/Category');
const Article = require('./Article');

router.get('/admin/articles', (req, res) => {
    Category.findAll({ raw: true }).then((articles) => {
        res.render('admin/articles/index.ejs', { articles });
    }).catch(err => {
        console.log(err);
        res.render('admin/articles/index.ejs');
    });                                                                                                                                                                                    
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then((categories) => {
    res.render('admin/articles/new.ejs', {categories});
    }).catch((err) => {
        console.log(err);
        res.render('admin/articles/new.ejs');
    });

});

router.post('/articles/save', (req, res) => {
    let body = req.body;
    body.slug = body.title.toLowerCase().split(' ').join('-');
    if(body){
        Article.create(body).then(() => {
            res.redirect('/admin/articles');
        }).catch(err => {
            console.log(err);
        })
    } else {
        res.redirect('/admin/articles/new');
    }
})

module.exports = router;
