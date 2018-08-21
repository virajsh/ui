var express = require('express');
var router = express.Router();
var fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();
// get the seed data
//var data = require('../seed-data');

// function getBlog(alias){
//     if(alias){
//         var index = parseInt(data.blogIndex[alias]);
//         return data.myBlog[index];
//     }else{
//         return data.myBlog;
//     }
// }

router.get('/', function (req, res, next) {
    client.get("http://localhost:3030/blogs", function (jsonData, response){
    var random = Math.floor(Math.random() * jsonData.data.length);
    res.render('blog', { 
        title: 'Blog', 
        navBlog: true, 
        showFooter: true, 
        extraCss: ['/css/blog.css'],
        
        featuredBlog: jsonData.data[random] ,
        blog: jsonData.data,
    });
});
});
  
router.get('/:blogAlias', function (req, res, next) {
    
    client.get("http://localhost:3030/blogs/"+ req.params.blogAlias,
    function (jsonData, response) {
    
    res.render('blog-detail', { 
      title: jsonData.data.name ,
      navBlog: true, 
      showFooter: true, 
      extraCss: ['/css/blog.css'],
      blog: jsonData.data,
      categories: jsonData.data.blogCategories
    });
});
});

module.exports = router;