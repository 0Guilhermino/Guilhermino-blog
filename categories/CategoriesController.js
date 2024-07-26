const express = require('express');
const router = express.Router();

const Category = require('./Category');

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new.ejs');
})

router.get('/admin/categories', (req, res) => {
    Category.findAll({ raw: true }).then((categories) => {
        res.render('admin/categories/index.ejs', { categories });
    }).catch(err => {
        console.log(err);
        res.render('admin/categories/index.ejs');
    });
})

router.get('/admin/categories/edit/:id', (req, res) => {
    const id = req.params.id;
    console.log(id, 'angelo')
    Category.findOne({ where: {id}, raw: true }).then((category) => {
        res.render('admin/categories/update.ejs', { category });
    }).catch(err => {
        console.log(err);
        res.render('admin/categories/update.ejs');
    });
})


router.post('/categories/save', (req, res) => {
    const title = req.body.title;
    const slug = title.toLowerCase().split(' ').join('-');

    if(title){
        Category.create({
            title,
            slug
        }).then(() => {
            res.redirect('/');
        }).catch(err => {
            console.log(err);
        })
    } else {
        res.redirect('/admin/categories/new');
    }
})

router.post('/categories/delete', (req, res) => {
    const categoryId = req.body.id;
 
    if(categoryId && !isNaN(categoryId)){
        console.log('entrou no if nan');
        Category.destroy({
            where: {
                id: categoryId
            }
         }).then(() => {
            res.redirect('/admin/categories');
         })
         .catch(err => {
            res.redirect('/admin/categories');
            console.log(err);
        });
    }else {
        res.redirect('/admin/categories');
    }
});

router.post('/categories/put', (req, res) => {
    
    let body = req.body;
    body.slug = body.title.toLowerCase().split(' ').join('-');
    
    if(body){
        console.log(body, 'entrou no if body');
        Category.update(body,{
            where: {
                id: body.id
            }
         }).then(() => {
            res.redirect('/admin/categories');
         })
         .catch(err => {
            res.redirect('/admin/categories');
            console.log(err);
        });
    }else {
        res.redirect('/admin/categories');
    }
});

module.exports = router;