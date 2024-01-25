const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {

  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }]
    });
    if (!tagData) {
      res.status(404).json({ 
        message: 'No product exist with current ID'
      });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // Validate request body
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Create tag
    const tagData = await Tag.create({ name });
    res.status(200).json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (tagData[0] === 0) {
      res.status(404).json({ 
        message: 'No record exists with the current ID'
      });
    } else {
      const updatedTagData = await Tag.findByPk(req.params.id);
      res.status(200).json(updatedTagData);
    }
  } catch (err) {
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (tagData === 0) {
      res.status(404).json({
        message: 'No tag exists with current ID'
      });
    } else {
      res.status(200).json(tagData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;