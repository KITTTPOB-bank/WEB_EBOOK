const express = require("express");
const pool = require("../config");

router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const search = req.query.search || ''
    let sql = 'SELECT a.*, c.penname FROM book AS a LEFT JOIN (SELECT * FROM author ) AS c on a.user_id = c.user_id WHERE a.status = "succeed";'
    let cond = []

    if (search.length > 0) {
      sql = 'SELECT a.*, c.penname FROM book AS a LEFT JOIN (SELECT * FROM author) AS c on a.user_id = c.user_id WHERE a.title LIKE ? OR a.desc LIKE ? OR a.type LIKE ? OR c.penname LIKE ? AND a.status = "succeed";'
      cond = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    }
    const [rows, fields] = await pool.query(sql, cond);
    console.log(rows)
    return res.json(rows);
  } catch (err) {
    return next(err)
  }
});
exports.router = router;
