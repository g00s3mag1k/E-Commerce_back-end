const router = require('express').Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {

  try {
    const categoryData = await Category.findAll(
      { include : [{ 
        model: Product }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {

  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ 
        model: Product }]
    });
    if (!categoryData) {
      res.status(404).json({ 
        message: 'There is no category with this ID.'
      });
      return;
    }
      res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {

  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    if (categoryData[0] === 1) {
      res.status(200).json(categoryData);
    } else {
      res.status(404).json({
        error: "No category found with that id"
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id);

    if (!categoryData) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;