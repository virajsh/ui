var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var client = new Client();

// function getProject(alias){
//     if(alias){
//         var index = parseInt(data.projectIndex[alias]);
//         return data.myProjects[index];
//     }else{
//         return data.myProjects;
//     }
// }

router.get('/', function (req, res, next) {
    // res.render('projects', { 
    //     title: 'Projects', 
    //     navProjects: true, 
    //     showFooter: true, 
    //     projects: getProject() 
    // });
    client.get("http://localhost:3030/projects", function (jsonData, response) {
        // parsed response body as js object
        console.log(jsonData);
        // raw response
        // console.log(response);
        res.render('projects', { 
            title: 'Projects', 
            navProjects: true, 
            showFooter: true, 
            projects: jsonData.data
        });
    });
});
  
router.get('/:projectAlias', function (req, res, next) {
    // var project = getProject(req.params.projectAlias);
    // res.render('project-detail', { 
    //   title: project.name ,
    //   navProjects: true, 
    //   showFooter: true, 
    //   project:  project
    client.get("http://localhost:3030/projects/"+ req.params.projectAlias, 
    function (jsonData, response) {
        // parsed response body as js object
        console.log(jsonData);
        // raw response
        // console.log(response);

        res.render('project-detail', { 
            title: jsonData.data.name ,
            navProjects: true, 
            showFooter: true, 
            project:  jsonData.data
        });
    });


});

router.get('/:projectAlias/demo', function (req, res, next) {
    var projectAlias = req.params.projectAlias;
    client.get("http://localhost:3030/projects/"+ projectAlias + "/demo",
    function (jsonData, response) {
        
        console.log(JSON.stringify(jsonData));
    res.render('demos/'+projectAlias, { 
      layout: 'layout-demo', 
      title: jsonData.data.name ,
      project: jsonData.data,
    });
});
});
module.exports = router;