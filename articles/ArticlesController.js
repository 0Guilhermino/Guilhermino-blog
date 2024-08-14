const express = require('express');
const router = express.Router();

const Category = require('../categories/Category');
const Article = require('./Article');

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then((articles) => {
        res.render('admin/articles/index.ejs', { articles });
    }).catch(err => {
        console.log(err);
        res.render('admin/articles/index.ejs');
    });
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then((categories) => {
        res.render('admin/articles/new.ejs', { categories });
    }).catch((err) => {
        console.log(err);
        res.render('admin/articles/new.ejs');
    });

});

router.post('/articles/save', (req, res) => {
    let body = req.body;
    body.slug = body.title.toLowerCase().split(' ').join('-');
    if (body) {
        Article.create(body).then(() => {
            res.redirect('/admin/articles');
        }).catch(err => {
            console.log(err);
        })
    } else {
        res.redirect('/admin/articles/new');
    }
})

router.post('/articles/delete', (req, res) => {
    const articleId = req.body.id;

    console.log('entrouble article');

    if (articleId && !isNaN(articleId)) {
        Article.destroy({
            where: {
                id: articleId
            }
        }).then(() => {
            res.redirect('/admin/articles');
        })
            .catch(err => {
                res.redirect('/admin/articles');
                console.log(err);
            });
    } else {
        res.redirect('/admin/articles');
    }
});

router.post('/articles/put', (req, res) => {

    let body = req.body;
    body.slug = body.title.toLowerCase().split(' ').join('-');

    console.log(body, 'body angelo')
    if (body) {
        Article.update(body, {
            where: {
                id: body.id
            }
        }).then(() => {
            res.redirect('/admin/articles');
        })
            .catch(err => {
                res.redirect('/admin/articles');
                console.log(err);
            });
    } else {
        res.redirect('/admin/articles');
    }
});


router.get('/admin/articles/edit/:id', (req, res) => {
    const id = req.params.id;
    Article.findByPk(id).then((article) => {
        Category.findAll().then((categories) => {
            console.log({ article, categories }, '{article, categories} angelo');
            res.render('admin/articles/update.ejs', { article, categories });
        }).catch((err) => {
            console.log(err);
            res.render('admin/articles/new.ejs');
        });
    }).catch(err => {
        console.log(err);
        res.render('admin/articles/index.ejs');
    });
})

router.get('/articles/page/:num', (req, res) => {
    const page = req.params.num;
    const limit = 1;
    let offset = (parseInt(page) - 1) * limit;

    if (isNaN(offset) || page <= 1) {
        offset = 0;
    }

    Article.findAndCountAll({
        limit,
        offset
    }).then((articles) => {

        let next = true;
        if (offset + 1 >= articles.count) {
            next = false;
        }

        const result = {
            next,
            articles
        }

        Category.findAll().then((categories) => {
            res.render("admin/articles/page", {result, categories, });  
        })
    }).catch(err => {
        console.log(err);
        res.render('articles');
    });
})

module.exports = router;
