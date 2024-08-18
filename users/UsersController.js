const express = require('express');
const router = express.Router();
const User = require('./User');

const bcrypt  = require('bcryptjs');


router.get('/admin/users', (req, res) => {
    res.render('admin/user/create.ejs');
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create.ejs');
})

router.post('/admin/users/new', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    if (email && password) {
        const salt = bcrypt.genSaltSync(3);
        const hash = bcrypt.hashSync(password, salt);
        User.create({
            email,
            password: hash
        }).then(() => {
            res.redirect('/');
        }).catch(err => {
            console.error(err);
            res.redirect('/');
        })
    }
})


module.exports = router;