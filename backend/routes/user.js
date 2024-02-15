const express = require("express")
const pool = require("../config")
const Joi = require('joi')
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/token");
const { isLoggedIn } = require('../middlewares')
router = express.Router();





router.post('/user/signup', async (req, res, next) => {
    
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 5)
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const sex = req.body.sex
    const birthdate = req.body.birthdate
    try {
        let results = await conn.query(
            'INSERT INTO users(username, password, first_name, last_name, email, sex, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, password, first_name, last_name, email, sex, birthdate]
        )
        await conn.query(
            'INSERT INTO author(penname, user_id) VALUES ("Guest", ?)',
            [results[0].insertId]
        )
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
});
router.get('/user/me', isLoggedIn, async (req, res, next) => {
    // req.user ถูก save ข้อมูล user จาก database ใน middleware function "isLoggedIn"

    res.json(req.user)
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

router.post('/user/login', async (req, res, next) => {

    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const username = req.body.username
    const password = req.body.password

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        // Check if username is correct
        const [users] = await conn.query(
            'SELECT * FROM users WHERE username=?',
            [username]
        )
        const user = users[0]
        if (!user) {
            throw new Error('Incorrect username or password')
        }

        // Check if password is correct
        console.log(password, user.password)
        if (!(await bcrypt.compare(password, user.password))) {

            throw new Error('Incorrect username or password')
        }

        // Check if token already existed
        const [tokens] = await conn.query(
            'SELECT * FROM tokens WHERE user_id=?',
            [user.id]
        )
        let token = tokens[0]?.token
        if (!token) {
            // Generate and save token into database
            token = generateToken()
            await conn.query(
                'INSERT INTO tokens(user_id, token) VALUES (?, ?)',
                [user.id, token]
            )
        }

        conn.commit()
        res.status(200).json({ 'token': token })
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }
})

router.delete('/user/logout', isLoggedIn, async (req, res, next) => {

    try {
        const [rows1, fields1] = await pool.query(
          'DELETE FROM tokens WHERE user_id = ?', [req.user.id]
        )
        res.json()
      } catch (error) {
        res.status(500).json(error)
      }
})

router.get("/adminPage", async function (req, res, next) {
    const adminsell = await pool.query(`SELECT a.*, c.penname FROM book AS a LEFT JOIN(SELECT * FROM author) AS c on a.user_id = c.user_id WHERE a.status = "wait";`,);
    const admindelete = await pool.query(`SELECT a.*, c.penname FROM book AS a LEFT JOIN(SELECT * FROM author) AS c on a.user_id = c.user_id WHERE a.status = "waitdelete";`,);
    const waitbuy = await pool.query("SELECT * FROM `order`  join cart c using(cart_id)",);
    const waitbuylist = await pool.query("SELECT order_id, title  fROM `order` join cart c using(cart_id) join cart_item ct using(cart_id) join book b on (b.id = ct.book_id)",);
    Promise.all([adminsell, admindelete, waitbuy, waitbuylist])
        .then((results) => {
            const [adminsell, a] = results[0];
            const [admindelete, b] = results[1];
            const [waitbuy, c] = results[2];
            const [waitbuylist, d] = results[3];
            res.json({
                adminsell: adminsell,
                admindelete: admindelete,
                waitbuy: waitbuy,
                waitbuylist: waitbuylist,
                error: null,
            });
        })
        .catch((err) => {
            return res.status(500).json(err);
        });
});
exports.router = router