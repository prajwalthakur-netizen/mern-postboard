const express = require('express');
const multer = require('multer');
const uploadFile = require("./services/storage.service")
const postModel = require("./models/post.model")
const cors = require("cors")
const ImageKit = require("@imagekit/nodejs")

const app = express();
app.use(cors());
app.use(express.json());

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

const upload = multer({ storage: multer.memoryStorage() })

app.post('/create-post', upload.single("image"), async (req, res) => {

    console.log(req.body);
    console.log(req.file);

    const result = await uploadFile(req.file.buffer)

    const post = await postModel.create({
        image: result.url,
        caption: req.body.caption,
        fileId: result.fileId,
    })

    return res.status(201).json({
        message: "post created successfully",
        post
    })
})

app.get("/posts", async (req, res) => {

    const posts = await postModel.find();

    return res.status(200).json({
        message: "posts fetched successfully",
        posts
    })
})

app.delete("/posts/:id", async (req, res) => {

    const post = await postModel.findById(req.params.id)

    if (!post) {
        return res.status(404).json({ message: "Post not found" })
    }

    // Delete image from ImageKit
    if (post.fileId) {
        await imagekit.files.delete(post.fileId)
    }

    // Delete from MongoDB
    await postModel.findByIdAndDelete(req.params.id)

    return res.status(200).json({ message: "Post deleted successfully" })
})

module.exports = app;
