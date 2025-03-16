const express = require("express");
const CatalogService = require("../lib/CatalogService");
const router = express.Router();

// Define your RESTful routes here
router.get("/items", async (req, res) => {
  try {
    const items = await CatalogService.getAll();

    return res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

router.get("/items/:id", async (req, res) => {
  try {
    const items = await CatalogService.getOne(req.params.id);

    return res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

router.post("/items", async (req, res) => {
  try {
    const item = await CatalogService.create(req.body);

    return res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

router.put("/items/:id", async (req, res) => {
  try {
    const item = await CatalogService.update(req.params.id, req.body);

    if (!item) return res.status(404).json({ error: "Item not found" });
    
    return res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

router.delete("/items/:id", async (req, res) => {
  try {
    const item = await CatalogService.remove(req.params.id, req.body);

    if (item.deleteCount === 0) return res.status(404).json({ error: "Item not found" });
    
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
});

module.exports = router;
