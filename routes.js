const express = require("express");
const router = express.Router();
const cn = require("./database");

// router.get('/tests', (req, res) => {
//   res.send('Router says Hello World!');
// })

router.get("/", (req, res) => {
  let queryVal =
    // `SELECT * FROM products
    // ORDER BY id
    // LIMIT ${req.query.count} | 5
    // OFFSET ${req.query.page} | 1`
    "SELECT * FROM products LIMIT 5";

  cn.query(queryVal, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data.rows);
      res.send(data.rows);
    }
  });
});

router.get("/:product_id/related", (req, res) => {
  let id = req.params.product_id;
  let params = [id];
  let queryVal = `SELECT
  ARRAY_AGG(related_product_id)
  from related
  where current_product_id = $1
  `;
  cn.query(queryVal, params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data.rows[0].array_agg);
    }
  });
});

// Select specific product w/ features attached to in in object form
router.get("/:product_id", (req, res) => {
  let id = req.params.product_id;
  params = [id];
  let queryVal = `
  SELECT products.id, products.name, products.slogan, products.description, products.category, products.default_price,
  jsonb_agg(
      jsonb_build_object(
          'feature', features.feature,
          'value', features.value
      )
    ) AS features

  FROM products
  LEFT JOIN features ON products.id = features.productId
  WHERE products.id = $1
  GROUP BY products.id`;

  cn.query(queryVal, params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(req);
      res.send(data.rows);
    }
  });
});

router.get("/:product_id/styles", (req, res) => {
  let id = req.params.product_id;
  let params = [id];
  let queryVal = `
    SELECT styles.productId as product_id,

    (SELECT jsonb_agg(resultExpression)
      FROM (
        SELECT
          styles.id as style_id,
          styles.name,
          styles.sale_price,
          styles.original_price,
          styles.default_price,

          (SELECT jsonb_agg(photosExpression)
            FROM (
              SELECT
                photos.thumbnail_url,
                photos.url
              FROM photos
              WHERE photos.styleId = styles.id
              GROUP BY photos.thumbnail_url, photos.url
            ) AS photosExpression
          ) AS photos,


          (SELECT jsonb_agg(skusExpression)
            FROM (
              SELECT
                skus.size,
                skus.quantity
              FROM skus
              WHERE skus.styleId = styles.id
              GROUP BY skus.size, skus.quantity
            ) AS skusExpression
          ) AS skus FROM styles WHERE styles.productId = $1 GROUP BY styles.id

      ) AS resultExpression
    ) AS results FROM styles WHERE styles.productId = $1
  `;

  cn.query(queryVal, params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(req);
      res.send(data.rows);
    }
  });
});

module.exports = router;
