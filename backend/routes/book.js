const express = require("express");
const path = require("path")
const pool = require("../config");
const multer = require("multer");
const { isLoggedIn } = require('../middlewares')
router = express.Router();
// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./static/uploads");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });


//////////////////////////////////////////////ไว้ใน Promotion/////////////////////////////////////////////////////////////////

// ข้อมูลโปรโมชั่น
router.get("/promotion_image", async function (req, res, next) {
  try {
    const promotion_image = await pool.query("SELECT * FROM promotion");
    res.send(promotion_image[0])
  }
  catch (e) {
    res.send(e)
  }

});

// รายละเอียดโปรโมชั่น
router.get("/DetailsPromotion/:id", async function (req, res, next) {
  const detailPro = await pool.query("SELECT * FROM promotion WHERE promotion_id=?", [
    req.params.id,
  ]);
  res.json(detailPro[0])
});

// ใช้โปรโมชั่น
router.put('/submitPromotion', isLoggedIn, async function (req, res, next) {
  const [row, fields] = await pool.query(

    'SELECT promotion_id FROM promotion WHERE code =?', [req.body.codepromotion])

  await pool.query(
    'UPDATE `cart` SET promotion_id = ? WHERE cart_id = ?',
    [row[0].promotion_id, req.body.cart_id]
  )
  res.json(row[0].promotion_id)
});

// ยกเลิกโปรโมชั่น
router.put('/canceltPromotion', isLoggedIn, async function (req, res, next) {
  const [row, fields] = await pool.query(

    'SELECT promotion_id FROM promotion WHERE code =?', [req.body.codepromotion])

  await pool.query(
    'UPDATE `cart` SET promotion_id = ? WHERE cart_id = ?',
    [null, req.body.cart_id]
  )
  res.json()
});

// แก้ไขราคาตามโปรโมชั่น
router.put('/usedpronotion', isLoggedIn, upload.single("myImage"), async function (req, res, next) {


  const [row1, fields1] = await pool.query(
    'UPDATE cart SET total_price = ? WHERE cart_id = ?',
    [req.body.price, req.body.cart_id]
  )


  const [row2, fields2] = await pool.query(
    "insert into `order` (cart_id, order_image, statement) values (?, ?, 'wait')",
    [req.body.cart_id, req.file.path]
  )
  res.json(req.body.price)

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////ไว้ใน ProfileBook รวมกับ ปุ่มอัปเดทสเตรท//////////////////////////////////////////////


// โปรไฟล์
router.get("/Profile", isLoggedIn, async function (req, res, next) {

  const profile1 = await pool.query(`select *
      from users u 
      join cart c
      on (u.id = c.user_id)
      join cart_item ct
      using(cart_id)
      join book b
      on (b.id = ct.book_id)
      join author a
      on (b.user_id = a.user_id)
      join payment p
      using(cart_id)
      where u.id = ?`,
    req.user.id,

  );
  const profile2 = await pool.query(`SELECT b.id, b.title, b.desc, b.type,b.image,b.status,b.price,a.penname
            from book b
            join users u
            on(b.user_id = u.id)
            join author a
            on(u.id = a.user_id)
            where u.id = ?`,
    req.user.id,

  );

  const profile3 = await pool.query(`SELECT u.id, first_name, last_name, email, username, imageProfile,b.title,b.desc,b.type,b.image,b.status,b.price,b.id as 'Bookid', penname, bank_number, bank_name, Phonenumber, payment_id
            from users u
            left outer join cart c
            on(u.id = c.user_id)
            left outer join payment p
            using(cart_id)
            left outer join cart_item ct
            using(cart_id)
            left outer join book b
            on(b.id = ct.book_id)
            left outer join author a
            on(u.id = a.user_id)
            where u.id = ?`,
    req.user.id,

  );

  Promise.all([profile1, profile2, profile3])
    .then((results) => {
      const [profilea, a] = results[0];
      const [profileb, b] = results[1];
      const [profilec, c] = results[2];

      res.json({
        mybook: profilea,
        mysellbook: profileb,
        username: profilec,
        error: null,
      });

    })
    .catch((err) => {
      return res.status(500).json(err);
    });

});

// เพิ่มหนังสือใหม่
router.post("/books", isLoggedIn, upload.single("myImage"), async function (req, res, next) {
  const file = req.file;
  if (!file) {

    return res.status(400).json({ message: "Please upload a file" });
  }

  const title = req.body.title;
  const type = req.body.type.join(', ');
  const price = req.body.price;
  const desc = req.body.desc;


  // Begin transaction
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {

    let results = await conn.query(
      `INSERT INTO book (book.price, book.title, book.desc, book.type, book.publish_date, book.image, book.status, book.user_id, book.admin_id) VALUES (?, ?, ?, ?, current_timestamp, ?, "succeed", ?, 7) `,
      [price, title, desc, type, file.path, req.user.id]
    );


    
    // console.log(bookId)

    // await conn.query(
    //   "INSERT INTO images(book_id, user_id, file_path, cover) VALUES ?;",
    //   [pathArray]
    // );

    await conn.commit();
    res.send("success!");
  } catch (err) {
    await conn.rollback();
    return res.status(400).json(err);
  } finally {
    conn.release();
  }
});

router.post("/promotions", isLoggedIn, upload.single("myImage"), async function (req, res, next) {
  const file = req.file;
  if (!file) {

    return res.status(400).json({ message: "Please upload a file" });
  }

  const title = req.body.title;
  const expi = req.body.expire_date;
  const desc = req.body.desc;
  const code = req.body.code;


  // Begin transaction
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    console.log(title)
    let results = await conn.query(
      `INSERT INTO promotion (promotion.title, promotion.desc, promotion.expire_date, promotion.admin_id, promotion.promotionimage, promotion.code, promotion.promotioncol, promotion.percentpromotion, promotion.amont) VALUES (?, ?, ?, 7, ?, ?, ">", 50, 1000) `,
      [title, desc, expi, file.path, code]
    );


    // const bookId = results[0].insertId;
    // console.log(bookId)

    // await conn.query(
    //   "INSERT INTO images(book_id, user_id, file_path, cover) VALUES ?;",
    //   [pathArray]
    // );

    await conn.commit();
    res.send("success!");
  } catch (err) {
    await conn.rollback();
    return res.status(400).json(err);
  } finally {
    conn.release();
  }
});


// หนังสือ
router.get("/DetailsBook/:id", async function (req, res, next) {
  const DetailsBook = await pool.query(`SELECT a.user_id, b.id, title, b.desc, b.type, penname, image, b.price, publish_date, b.status
   FROM book b join author a using(user_id) where b.id = ? `, [
    req.params.id,
  ]);
  res.json(DetailsBook[0])

});
router.get("/getContent/:id/:pId", async function (req, res, next) {
  const contentBook = await pool.query(`SELECT content FROM pages WHERE book_id = ? AND page_num = ?`, [
    req.params.id, req.params.pId
  ]);
  console.log(contentBook[0])
  res.json(contentBook[0])

});
router.post("/createPage/:id/:pId/:content", async function (req, res, next) {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {

    let results = await conn.query(
      `INSERT INTO pages (book_id, page_num, content) VALUES (?, ?, ?)`,
      [req.params.id, req.params.pId, req.params.content]
    );

    await conn.commit();
    res.send("success!");
  } catch (err) {
    await conn.rollback();
    return res.status(400).json(err);
  } finally {
    conn.release();
  }

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////ไว้ใน Cart ////////////////////////////////////////////////////////////////////////////////////////

// เช็คตะกร้า

router.get("/cart_check", isLoggedIn, async function (req, res, next) {
  const promise4 = await pool.query("SELECT * FROM cart where user_id = ?", [
    req.user.id,
  ]);
  const promise6 = await pool.query("SELECT * FROM cart join payment using(cart_id) where user_id = ?", [
    req.user.id,
  ]);
  const promise7 = await pool.query("SELECT * FROM book join cart_item  on(book.id = cart_item.book_id) join cart using(cart_id) join payment using(cart_id) join author on(book.user_id = author.user_id) where cart.user_id = ? And cart.cart_id = payment.cart_id", [
    req.user.id,
  ]);
  Promise.all([promise4, promise6, promise7])
    .then((results) => {
      const [cart, imageFields] = results[0];
      const [payment, commentFields] = results[1];
      const [mybook, c] = results[2];
      res.json({
        cart: cart,
        payment: payment,
        mybook: mybook,
        error: null,
      });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

// โชว์หนังสือในตระกร้า
router.get("/cartitem/:id", isLoggedIn, async function (req, res, next) {
  const cartitem = await pool.query("SELECT item_no, book_id, price, cart_id, total_price, promotion_id FROM cart_item join cart using(cart_id) where cart_id = ?;", [
    req.params.id,]);
  return res.json(cartitem[0]);

});

router.get("/getCartItem", isLoggedIn, async function (req, res, next) {
  const cartitem = await pool.query(`SELECT c.cart_id, item_no, ct.price, c.total_price, b.image, b.title, b.id, promotion_id
FROM cart_item ct
join cart c
using(cart_id) 
join users u
on(c.user_id = u.id)
join book b
on(b.id = ct.book_id)
where c.cart_id not in (
select p.cart_id
from payment p) 
and u.id = ? and cart_id not in (select cart_id
from ebook.order)`
    , [
      req.user.id]);

  res.json(cartitem[0]);

});




// เพิ่มตะกร้า
router.post('/addcart', isLoggedIn, async function (req, res, next) {
  try {
    const [rows1, fields1] = await pool.query(
      'INSERT INTO `cart` (`create_date`, `total_price`, `user_id`, `promotion_id`) VALUES (CURRENT_TIMESTAMP, 0, ?, null )',
      req.user.id
    )
    const [rows2, fields2] = await pool.query(
      'select * from cart where cart_id = ?',
      [rows1.insertId]
    )
    res.json(rows2)
  } catch (err) {
    console.log(err)
  }
});

// เพิ่มหนังสือลงในตะกร้า
router.post('/addbook/:id', isLoggedIn, async function (req, res, next) {
  try {
    const [rows, fields] = await pool.query(
      `SELECT c.cart_id
        FROM cart c
        join users u
        on(c.user_id = u.id)
        where c.cart_id not in (
        select p.cart_id
        from payment p) 
        and u.id = ?`,
      req.user.id
    )

    const [rows1, fields1] = await pool.query(
      'INSERT INTO `cart_item` (`book_id`, `price`, `cart_id`) VALUES (?, ?, ?)',
      [req.params.id, req.body.price, rows[rows.length - 1].cart_id]
    )
    const [rows2, fields2] = await pool.query(
      'select * from cart_item where item_no = ?',
      [rows1.insertId]
    )
    res.json(rows2)
  } catch (err) {
  }
});
// เพิ่มราคาหนังสือตามที่เอาลงตะกร้า
router.put('/totalprice', isLoggedIn, async function (req, res, next) {


  const [rows, fields] = await pool.query(
    `SELECT c.cart_id
        FROM cart c
        join users u
        on(c.user_id = u.id)
        where c.cart_id not in (
        select p.cart_id
        from payment p) 
        and u.id = ?`,
    req.user.id
  )

  const [rows3, fields3] = await pool.query(
    'SELECT total_price FROM cart WHERE cart_id =?', [rows[rows.length - 1].cart_id])
  await pool.query(
    'UPDATE `cart` SET total_price = ? WHERE cart_id = ?',
    [rows3[0].total_price + req.body.price, [rows[rows.length - 1].cart_id]]
  )

});


// ลบหนังสือออกจากตะกร้า
router.delete('/dropbook/:id', async function (req, res, next) {
  try {
    const [rows1, fields1] = await pool.query(
      'DELETE FROM cart_item WHERE item_no = ?', [req.params.id]
    )
    res.json()
  } catch (error) {
    res.status(500).json(error)
  }
});

// ลบราคาหนังสือตามที่เอาลงตะกร้า
router.put('/droptotalprice', isLoggedIn, async function (req, res, next) {
  const [row, fields] = await pool.query(

    'SELECT total_price FROM cart WHERE cart_id =?', [req.body.cart_id])

  await pool.query(
    'UPDATE `cart` SET total_price = ? WHERE cart_id = ?',
    [row[0].total_price - req.body.price, req.body.cart_id]
  )
  res.json()

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////// ไว้ใน Order //////////////////////////////////////////////////////////////////
// ออเดอร์
router.get('/order', isLoggedIn, async function (req, res, next) {

  const [row, fields] = await pool.query('SELECT * FROM `order` join cart c using(cart_id)  where c.user_id = ?',
    req.user.id)
  res.send(row)

});

// รายการในออเดอร์
router.get('/orderlist', isLoggedIn, async function (req, res, next) {
  const [row, fields] = await pool.query('SELECT order_id, title  fROM `order` join cart c using(cart_id) join cart_item ct using(cart_id) join book b on (b.id = ct.book_id) where c.user_id = ?',
    req.user.id)
  res.json(row)
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////// ไว้ใน Admin /////////////////////////////////////////////////
// หน้าแอดมิน
//submit
router.put('/submit/:id', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "succeed" WHERE id = ?',
    [req.params.id]
  )
  res.json()

});

//unsubmit
router.put('/unsubmit/:id', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "not_succeed" WHERE id = ?',
    [req.params.id]
  )
  res.json()

});
//submitdelete
router.delete('/submitdelete/:id', async function (req, res, next) {
  try {
    const [rows2, fields2] = await pool.query(
      'DELETE FROM pages WHERE book_id = ?', [req.params.id]
    )
    const [rows1, fields1] = await pool.query(
      'DELETE FROM book WHERE id = ?', [req.params.id]
    )

    res.json()
  } catch (error) {
    res.status(500).json(error)
  }
});
//unsubmitdelete
router.put('/unsubmitdelete/:id', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "succeed" WHERE id = ?',
    [req.params.id]
  )
  res.json()
});


router.put('/unsubmitorder/:id', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `order` SET statement = "not_succeed" WHERE order_id = ?',
    [req.params.id]
  )
  res.json()

});
//unsubmitorder
router.put('/submitorder/:id/:cid', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `order` SET statement = "succeed" WHERE order_id = ?',
    [req.params.id]
  )
  const [row2, fields2] = await pool.query(
    "insert into `payment` (purchase_date, cart_id, imagepayment) values ( CURRENT_TIMESTAMP,?, NULL)",
    [req.params.cid]
  )
  res.json()

});
//ดึงไอดีแอดมินมาเช็ค
router.get("/admindcheck", isLoggedIn, async function (req, res, next) {
  try {
    const [row, fields] = await pool.query("SELECT * FROM administrator a join users u on (a.user_id = u.id) where u.id = ?",
      req.user.id);
    res.json(row[0])
  }
  catch (e) {
    res.send(e)
  }

});

//ส่งไปยืนยันลบของแอดมิน
router.put('/gowaitdelete/:id', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "waitdelete" WHERE id = ?',
    [req.params.id]
  )
  res.json()

});

//ส่งไปให้นักเขียนแก้ไข
router.put('/gowaitedit/:id', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "unready" WHERE id = ?',
    [req.params.id]
  )
  res.json()

});

router.put('/setready/:bid', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "ready" WHERE id = ?',
    [req.params.bid]
  )
  res.json()

});
router.put('/setwait/:bid', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "wait" WHERE id = ?',
    [req.params.bid]
  )
  res.json()

});
router.put('/setwaitdelete/:bid', isLoggedIn, async function (req, res, next) {
  await pool.query(
    'UPDATE `book` SET status = "waitdelete" WHERE id = ?',
    [req.params.bid]
  )
  res.json()

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.router
  = router;


