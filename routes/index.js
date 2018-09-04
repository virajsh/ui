var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var Client = require('node-rest-client').Client;
var client = new Client();

router.get('/', function (req, res, next) {
  res.render('index', { layout: 'layout-index', navHome: true });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', showFooter: true, navAbout: true });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact', showFooter: true, navContact: true });
});

router.post('/contact', function(req, res, next) {
  // read the values passed from the ui
  var data = req.body;
  console.log(JSON.stringify(data));
var output = `
<p> You have a new contact</p>
<h3>Contact Details</h3>
<ul>
<li> Name:${data.name}</li>
<li> Email:${data.email}</li>
<li> Mobile:${data.mobile}</li>

</ul>
<h3> Message</h3>
<p>${data.description} </p>
`;

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: 'vir******@*****.com' , // generated ethereal user
      pass: '*ldwsup*oiospgl*' , // generated ethereal password
  },
  tls:{
    rejectUnauthorised:false
  }

});

// setup email data with unicode symbols
let mailOptions = {
  from: '"Vj" <virajshsr@gmail.com>', // sender address
  to: 'virajhosur@yahoo.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello Viraj?', // plain text body
  html: output, // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
 
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

});


  res.render('confirm', { title: 'Contact', showFooter: true, navContact: true, data: data });
});



//resume


router.get('/resume', function(req, res, next) {
  res.redirect('/vj-resume.pdf'); 
});




//sign-in get

router.get('/signin', function(req, res, next) {
  res.render('admin/signin', { layout: 'layout-signin' });
});




//sign-in post

router.post('/signin', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email);
  console.log(password);
  if(email && email !== '' && password && password !== '' ){
  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
};
  client.post("http://localhost:3030/signin",args, function (jsonData,response){
  // authenticate the user details
  // console.log(JSON.stringify(jsonData));
  
    // create the session
    if(jsonData.data){
    req.session.isAuthenticated = true;
    req.session.user = {'email': jsonData.data.email};
    res.locals.user = {'email': jsonData.data.email};

    res.render('admin/dashboard', { 
      layout: 'layout-admin', 
      title: 'Admin Dashboard',
      navDashboard: true
    });
  }else{
    res.render('admin/signin', { layout: 'layout-signin' });
  }
  
});
}
   else{
    var message = "Invalid email or password";
    res.render('admin/signin', { layout: 'layout-signin', error: true, message: message});
  }});





  //sign-up get
router.get('/signup', function (req, res, next) {
  res.render('admin/signup', { layout: 'layout-signin' });
});

//sign up post
router.post('/signup', function (req, res, next) {

  var args = {
    data: req.body,
    headers: { "Content-Type": "application/json" }
    };

  client.post("http://localhost:3030/signup",args, function (jsonData,response){
 res.json({code:200,data: jsonData.data});
  

});
});



//sign-out


router.get('/signout', function(req, res, next) {
  req.session.isAuthenticated = false;
  delete req.session.user;
  res.redirect('/signin'); 
});
module.exports = router;