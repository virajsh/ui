var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();


router.get('/', function (req, res, next) {
  res.render('admin/dashboard', { 
    layout: 'layout-admin', 
    title: 'Admin Dashboard',
    navDashboard: true
  });
});

router.get('/projects', function (req, res, next) {
  client.get("http://localhost:3030/projects", function (jsonData, response){
  res.render('admin/projects', { 
    layout: 'layout-admin', 
    title: 'Projects Admin',
    navProjects: true,
    projects: jsonData.data  
  });
  });
});



router.get('/projects/:projectAlias', function (req, res, next) {
  client.get("http://localhost:3030/projects/"+ req.params.projectAlias, 
    function (jsonData, response) {
      
  // var project = getProject(req.params.projectAlias);
  res.render('admin/project-detail', { 
    layout: 'layout-admin', 
    title: jsonData.data.name,
    navProjects: true,
    project:jsonData.data
  });
  });
});


// router.get('/projects/create', function (req, res, next) {
//   res.render('admin/project-create', { 
//     layout: 'layout-admin', 
//     title: 'Projects Admin',
//     navProjects: true
//   });
// });

// router.post('/projects/create', function (req, res, next) {
//   var args = {
//     data: req.body,
//     headers: { "Content-Type": "application/json" }
// };
//   client.post("http://localhost:3030/projects",args, function (jsonData,response){
//     if(jsonData){
//     res.json({code: 200, data: jsonData.data});
//     }
//     else{
//       res.json({code :500, message : jsonData.message})
//     };

// });
// });

// router.post('/projects/:projectAlias/update', function (req, res) {
  
//   var args = {
//     data: req.body,
//     headers: { "Content-Type": "application/json" }
//     };

//   client.post("http://localhost:3030/projects/:projectAlias",args, function (jsonData, response){

//    var pAlias = req.params.projectAlias;
  
//     res.redirect('/admin/projects/'+ pAlias);
  
// });



router.get('/blogs', function (req, res, next) {
  
  client.get("http://localhost:3030/admin/blogs", function (jsonData, response){
  console.log(jsonData.data);
  res.render('admin/blog', { 
    layout: 'layout-admin', 
    title: 'Blog Admin',
    navBlog: true,
    blogs:  jsonData.data
  });
  });
});




module.exports = router;