const envalid = require("envalid");
var path = require('path')
var express = require('express')
const app = express();
const axios = require("axios");

require('dotenv').config();

// Get environment variables
const env = envalid.cleanEnv(process.env, {
    CLIENT_ID: envalid.str(),
    CLIENT_SECRET: envalid.str(),
    REDIRECT_URI: envalid.url({default: "http://localhost:5000/linkedin-redirect"})
});

const LinkedInAPI = require('node-linkedin-v2');
const linkedInAPI = new LinkedInAPI(env.CLIENT_ID, env.CLIENT_SECRET, env.REDIRECT_URI);

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')))

app.get('/graph', function (req, res) {
  res.render('graph', { title: 'Graph', message: 'Customer Graph', info_id: req.params.info_id })
})

// Construct url and redirect to the auth dialog
app.get("/", (req, res) => {
    try {
      //var scope = ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups', 'w_messages'];
      var scope = ['r_liteprofile', 'r_emailaddress', 'w_member_social'];
      const authURL = linkedInAPI.getAuthorizationUrl(scope, 'state');
      res.redirect(authURL);
    } catch (error) {
      res.send("Unable to getAuthUrl:" + error);
    }
});

// Get 'code' querystring parameter and hit data api
app.get("/linkedin-redirect", async (req, res) => {

console.log("linkedin-redirect getCurrentMemberProfile error:" + req.query.code);
// res.send("linkedin-redirect:" + req.query.code);

  try {
    // var token = linkedInAPI.getAccessToken(req.query.code, req.query.state);
    // res.send("linkedin-redirect token:" + token);


    linkedInAPI.getAccessToken(req.query.code, req.query.state)
    .then(response => {
      console.log("linkedin-redirect getAccessToken:" + response);
      linkedInAPI.getCurrentMemberProfile(['id', 'firstName', 'lastName'], response.access_token)
        .then(response => {
          console.log("linkedin-redirect getCurrentMemberProfile:" + response);
          res.send(JSON.stringify(response));
        })
    })
    .catch(err => {
      console.log("linkedin-redirect getAccessToken error:" + err);
    });


    //linkedInAPI.getAccessToken(res, req.query.code, req.query.state, function(err, results) {

    // if ( err )
    //     return console.error(err);

    //console.log(JSON.stringify(results));

    // linkedInAPI.init(results.access_token);
    // linkedInAPI.getCurrentMemberProfile(['id', 'firstName', 'lastName'], results.access_token)
    // .then(response => {
    //   console.log("linkedin-redirect getCurrentMemberProfile:" + response);
    //   res.send("Member:" + JSON.stringify(response));
    //   done();
    // })
    // .catch(err => {
    //   console.log("linkedin-redirect getCurrentMemberProfile error:" + err);
    //   done()
    // });
  // });
  } catch (error2) {
    console.log("linkedin-redirect getAccessToken error2:" + error2);
  }

});

app.listen(5000, () => console.log("App listening on port 5000..."));
