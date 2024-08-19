const express = require('express');
const router = express.Router();
const User = require('./User');

const bcrypt  = require('bcryptjs');


router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create.ejs');
})

router.get('/admin/users', (req, res) => {
    User.findAll()
    .then((users) => {
        console.log(users);
       res.render('admin/users/index', {users});
    }).catch((err) => {
        console.error(err);
       res.render('admin/users/index.ejs');
    })

})

const validateUserData = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send("Email e senha são obrigatórios");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("Email inválido");
    }

    if (password.length < 8) {
        return res.status(400).send("A senha deve ter pelo menos 8 caracteres");
    }

    next();
};

// Função para hash da senha
const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

// Função para criar usuário
const createUser = async (email, password) => {
    const hashedPassword = hashPassword(password);
    return User.create({ email, password: hashedPassword });
};

router.post('/admin/users/new', validateUserData, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        
        if (user) {
            return res.redirect('/admin/users/create');
        }

        await createUser(email, password);
        res.redirect('/');
    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.status(500).send("Erro interno no servidor");
    }
});


module.exports = router;