//jshint esversion: 6
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //console.log(firstName, lastName, email);

  //first create a js obj, this is our data object
  //reff-https://mailchimp.com/developer/marketing/api/abuse-reports/
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  //above code is in js, but we need it in flatpack JSON
  const jsonData = JSON.stringify(data);
  const url = "https://us6.api.mailchimp.com/3.0/lists/XXXX";
  //we now create options, most imp is method->POST
  const options = {
    method: "POST",
    auth: " ishika:XXXXXXXXX",
  };
  //now we create our request
  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  //here we use the above saved request lol
  //we pass the JSONdata to the mailchimp server
  request.write(jsonData);
  //to specifiy that we are done with the request we use request.end
  request.end();
});

//post request,for failure :*
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 8000, function () {
  console.log("Server started!");
});

//process.env.PORT->dynamic port that heroku will manage
