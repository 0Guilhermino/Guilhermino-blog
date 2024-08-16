const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const Category = require('./categories/Category');

const articlesController = require('./articles/ArticlesController');
const Article = require('./articles/Article'); 

const userController = require('./users/UsersController');
const User = require('./users/User'); 

//views
app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//conexão com o banco de dados
connection
.authenticate()
.then(() => {
    console.log('Conexão realizada com sucesso!');
})
.catch((e) => {
    console.log(e);
})

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', userController);

//rotas
app.get('/', (req, res) => {
    Article.findAll({
            order: [['id', 'DESC']],
            limit: 2  
    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render('index', {articles, categories});
        }).catch((err) => {
        console.log(err);
        });
    })
});

app.get('/:slug', (req, res) => {
    const slug = req.params.slug;
    Article.findOne({
        where: {
            slug
        }
    }).then((article) => {
        if(article){
            Category.findAll().then((categories) => {
                res.render('article', {article, categories});
            }).catch((err) => {
            console.log(err);
            });
        } else {
            res.redirect('/');
        }
    }).catch((error) => {console.log(error);res.redirect('/') });
});

app.get('/category/:id', (req, res) => {
    const id = req.params.id;
    console.log('entrou aqui');
    Category.findOne({ 
        where: {
            id: id
        },
        include: [{model: Article}]
     }).then((category) => {
        if (category) {
            Category.findAll().then((categories) => {
                console.log({
                    articles: category.articles,
                    categories,
                }, 'obj angelo');
                res.render('index', {
                    articles: category.articles,
                    categories,
                });
            });
        } else {
         res.render('/');
        }
    }).catch(err => {
        console.log(err);
        res.render('index');
    });
})

app.listen(port, (req, res) => {
    console.log(`Server is running at http://localhost:${port}`);
});