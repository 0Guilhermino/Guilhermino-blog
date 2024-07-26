const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const Category = require('./categories/Category');

const articlesController = require('./articles/ArticlesController');
const Article = require('./articles/Article'); 

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

//rotas
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, (req, res) => {
    console.log(`Server is running at http://localhost:${port}`);
});