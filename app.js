//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "";
const aboutContent = "";
const contactContent = "";


const connectDB = async() => {
    await mongoose.connect("mongodb+srv://mongo:ox0SXHQoKYtWwqS9@cluster1.d48cs66.mongodb.net/blogDB?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });

    console.log("MongoDB Connected");
};

connectDB();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// // mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });
// mongoose.connect("mongodb+srv://mongo:ox0SXHQoKYtWwqS9@cluster1.d48cs66.mongodb.net/?retryWrites=true&w=majority/blogDB", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {

  let posts = await Post.find({});
  // console.log(posts);
  res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// app.get("/posts/:postId", async function (req, res) {

//   const requestedPostId = req.params.postId;

//   var post = Post.findOne({ _id: requestedPostId });

//   res.render("post", {
//     title: post.title,
//     content: post.content,
//   });


// });

// app.get("/posts/:postId", function (req, res) {

//   const requestedPostId = req.params.postId;

//   Post.findOne({ _id: requestedPostId }, function (err, post) {
//     res.render("post", {
//       title: post.title,
//       content: post.content
//     });
//   });

// });

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    if (err) {
      console.error("Error fetching post:", err);
      return res.status(500).send("An error occurred");
    }

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});


app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
