var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var unzip = require('unzip');
var projectService = require('../service/projectService');
var mediaService = require('../service/mediaService');
var Client = require('node-rest-client').Client;
var client = new Client();

//dashboard render
router.get('/', function (req, res, next) {
  res.render('admin/dashboard', {
    layout: 'layout-admin',
    title: 'Admin Dashboard',
    navDashboard: true
  });
});

//get project list
router.get('/projects', function (req, res, next) {
  client.get("http://localhost:3030/projects", function (jsonData, response) {
    res.render('admin/projects', {
      layout: 'layout-admin',
      title: 'Projects Admin',
      navProjects: true,
      projects: jsonData.data
    });
  });
});


//get project detail
router.get('/projects/:projectAlias', function (req, res, next) {
  client.get("http://localhost:3030/projects/" + req.params.projectAlias,
    function (jsonData, response) {

      res.render('admin/project-detail', {
        layout: 'layout-admin',
        title: jsonData.data.name,
        navProjects: true,
        project: jsonData.data
      });
    });
});



//project create get

router.get('/create', function (req, res, next) {

  res.render('admin/project-create', {
    layout: 'layout-admin',
    title: 'Projects Admin',
    navProjects: true
  });
});


//project create post
router.post('/create', function (req, res, next) {

  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
  };
  client.post("http://localhost:3030/admin/create", args, function (jsonData, response) {

    res.redirect('/admin/projects');

  });
});


//update project
router.post('/projects/:projectAlias/update', function (req, res, next) {
  console.log(req.params.projectAlias);
  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
  };
  client.post("http://localhost:3030/admin/project/" + req.params.projectAlias, args, function (jsonData, response) {
    res.redirect('/admin/projects');
  });
});

//delete project
router.get('/projects/:projectAlias/delete', function (req, res, next) {


  client.delete("http://localhost:3030/admin/" + req.params.projectAlias, function (jsonData, response) {
    res.redirect('/admin/projects');
  });
});


// get upload page
router.get('/projects/:projectAlias/upload', function (req, res, next) {
  var pAlias = req.params.projectAlias;
  res.render("admin/upload", {
    layout: 'layout-admin',
    title: 'Upload Cover Image',
    navProjects: true,
    actionUrl: '/admin/projects/' + pAlias + '/upload'
  });
});





//upload cover photo
router.post('/projects/:projectAlias/upload', function (req, res, next) {

  var pAlias = req.params.projectAlias;
  var dir = path.join(__dirname, '../public/images/projects');
  var finishUpload = function (err, data) {

    if (err) {
      //throw new Error('errro...');
      console.log(err)
      res.render('404');
    } else {
      res.redirect('/admin/projects/' + pAlias);
    }
  };

  var callback = function (error, data) {
    if (error) {
      console.log(error);
    } else {
      var args = {
        "data": {
          image: "/images/projects/" + pAlias + ".png",
        },
        headers: {"Content-Type": "application/json"}
      };

      client.post('http://localhost:3030/admin/project/' + pAlias, args, function (jsonData, response) {
        finishUpload(null);
      });
      
    }
  };

  mediaService.uploadMedia(req, res, dir, pAlias + '.png', callback);
});


//get blogs

router.get('/blogs', function (req, res, next) {

  client.get("http://localhost:3030/admin/blogs", function (jsonData, response) {
    console.log(jsonData.data);
    res.render('admin/blog', {
      layout: 'layout-admin',
      title: 'Blog Admin',
      navBlog: true,
      blogs: jsonData.data
    });
  });
});


//get blog detail
router.get('/blogs/:blogAlias', function (req, res, next) {
  client.get("http://localhost:3030/blogs/" + req.params.blogAlias,
    function (jsonData, response) {

      res.render('admin/blog-detail', {
        layout: 'layout-admin',
        title: jsonData.data.name,
        navBlog: true,
        blog: jsonData.data
      });
    });
});
//create blog get
router.get('/createBlog', function (req, res, next) {

  res.render('admin/blog-create', {
    layout: 'layout-admin',
    title: 'Blogs Admin',
    navBlog: true
  });
});

//create blog post
router.post('/createBlog', function (req, res, next) {

  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
  };
  client.post("http://localhost:3030/admin/createBlog", args, function (jsonData, response) {

    res.redirect('/admin/blogs');

  });
});

//update blog
router.post('/blogs/:blogAlias/update', function (req, res, next) {
  console.log(req.params.blogAlias);
  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
  };
  client.post("http://localhost:3030/admin/blogs/" + req.params.blogAlias, args, function (jsonData, response) {
    res.redirect('/admin/blogs');
  });
});

//delete blog
router.get('/blogs/:blogAlias/delete', function (req, res, next) {


  client.delete("http://localhost:3030/admin/blogs/" + req.params.blogAlias, function (jsonData, response) {
    res.redirect('/admin/blogs');
  });
});

// get upload page
router.get('/blogs/:blogAlias/upload', function (req, res, next) {
  var bAlias = req.params.blogAlias;
  res.render("admin/upload", {
    layout: 'layout-admin',
    title: 'Upload Cover Image',
    navBlog: true,
    actionUrl: '/admin/blogs/' + bAlias + '/upload'
  });
});





//upload cover photo
router.post('/blogs/:blogAlias/upload', function (req, res, next) {

  var bAlias = req.params.blogAlias;
  var dir = path.join(__dirname, '../public/images/blog');
  var finishUpload = function (err, data) {

    if (err) {
      //throw new Error('errro...');
      console.log(err)
      res.render('404');
    } else {
      res.redirect('/admin/blogs/');
    }
  };

  var callback = function (error, data) {
    if (error) {
      console.log(error);
    } else {
      var args = {
        "data": {
          image: "/images/blog/" + bAlias + ".png",
        },
        headers: {"Content-Type": "application/json"}
      };

      client.post('http://localhost:3030/admin/blogs/' + bAlias, args, function (jsonData, response) {
        finishUpload(null);
      });
      
    }
  };

  mediaService.uploadMedia(req, res, dir, bAlias + '.png', callback);
});

// //upload project demo get
// router.get('/projects/:projectAlias/uploaddemo', function (req, res) {
//   var pAlias = req.params.projectAlias;
//   res.render('admin/upload', { 
//     layout: 'layout-admin', 
//     title: 'Upload demo project',
//     navProjects: true,
//     actionUrl: '/admin/projects/'+ pAlias+ '/uploaddemo'
//   });
// });
// //upload project demo post
// router.post('/projects/:projectAlias/uploaddemo', function (req, res, next) {
//   var pAlias = req.params.projectAlias;
//   var dir = path.join(__dirname, '../public/project-demo/'+ pAlias);
//   var finishUpload = function (err, data){
//     if(err){
//       console.error(err)
//       throw new Error('errro...');
//     }else{
//       // unzip the contents to the same folder
//       var zipfile = dir + '/' + pAlias + '.zip';
//       // how to handle this error???
//       fs.createReadStream(zipfile).pipe(unzip.Extract({ path: dir }));
//       fs.unlinkSync(zipfile);
//       res.redirect('/admin/projects/' + pAlias);
//     }
//   };
  
//   mediaService.uploadMedia(req, res, dir, pAlias + '.zip', finishUpload);
// });


module.exports = router;