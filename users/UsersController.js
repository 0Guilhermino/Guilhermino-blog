const express = require('express');
const router = express.Router();

const User = require('./User');

router.get('/admin/users', (req, res) => {
    res.render('admin/user/create.ejs');
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create.ejs');
})

router.post('/admin/users/create', (req, res) => {
    const body = req.body;

    console.log(body, 'body angelo');

    if (body) {
        User.create(body).then(() => {
          res.render('admin/users/create.ejs');
        }).catch(err => {
            console.error(err);
        })
    }
})


module.exports = router;