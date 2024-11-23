const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Post = require("./models/postModel");


const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Atlas connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/posts", async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.post("/posts", async (req, res) => {
    const { title, description, author } = req.body;
    const newPost = new Post({ title, description, author });
    await newPost.save();
    res.json(newPost);
});

app.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, author } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(id, { title, description, author }, { new: true });
    res.json(updatedPost);
});


app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted" });
});

const path = require("path");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
