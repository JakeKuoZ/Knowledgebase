const express = require('express');
const db = require('../Config/mongoConnections');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ObjectId } = require('mongodb');

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save the file with a timestamp to avoid duplicates
    }
});

const upload = multer({ storage: storage });

// Create an article (with optional image upload)
router.post('/', upload.single('image'), async (req, res) => {
    const { title, content, tags } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const articlesCollection = await db.articles();
        const newArticle = {
            title,
            content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // Convert tags to an array
            image,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await articlesCollection.insertOne(newArticle);
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ error: 'Error creating article' });
    }
});

// GET route for fetching all articles
router.get('/', async (req, res) => {
    try {
        const articlesCollection = await db.articles();
        const articles = await articlesCollection.find({}).toArray(); // Fetch all articles
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Error fetching articles' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid article ID' });
    }

    try {
        const articlesCollection = await db.articles();
        const article = await articlesCollection.findOne({ _id: new ObjectId(id) });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Error fetching article' });
    }
});

// Serve the uploaded images
router.use('/images', express.static('uploads'));

module.exports = router;