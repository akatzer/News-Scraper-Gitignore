var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



var MONGODB_URI = process.env.MONGODB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/homeworkdb";

mongoose.connect(MONGODB_URI, function(err, res){
  if (err) {
    console.log('error connectiong to: ' + MONGODB_URI + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + MONGODB_URI);
  }
})


app.get("/scrape", function (req, res) {
  
  axios.get("https://www.nytimes.com/section/sports").then(function (response) {
    var $ = cheerio.load(response.data);
   
    $("a.story-link").each(function (i, element) {
      var result = {};
      result.link = $(this).attr("href");
      result.title = $(this).find("h2.headline").text();
      result.summary = $(this).find("p.summary").text();
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});

app.get("/delete", function (req, res) {
  db.Article.deleteMany({})
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function (err) {
    res.json(err);
  });
})

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
