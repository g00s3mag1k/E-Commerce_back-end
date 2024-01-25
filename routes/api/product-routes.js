const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', async (req, res) => {

  try {
    const productData = await Product.findAll({
      include: [Category, 
        { model: Tag, through: ProductTag}]
    });
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {

  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [Category, 
        { model: Tag, through: ProductTag}]
    });
    if (!productData) {
      res.status(404).json({ 
        message: 'No product exist with current ID'});
        return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {

  Product.create(req.body)
    .then((product) => {

      // Check if tagIds is defined and not empty
      if (req.body.tagIds && req.body.tagIds.length > 0) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr)
          .then(() => res.status(200).json(product));
      }

      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id }
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'An error occurred' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id }
    });
    if (productData === 0) {
      res.status(404).json({
        message: "No product exists with the current ID"
      });
    } else {
      res.status(200).json(productData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;