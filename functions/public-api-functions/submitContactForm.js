// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const { onRequest } = require("firebase-functions/https");

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.PASSWORD}`,
  },
});

const handler = async (req, res) => {
  // Set CORS headers for preflight requests
  // Allows GETs from any origin with the Content-Type header
  // and caches preflight response for 3600s

  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    // Check for POST request
    if (req.method !== "POST") {
      res.status(400).send("Please send a POST request");
      return;
    }

    //get the email and message from the request
    const { email, message, name } = req.body;

    if (!email) {
      res.status(400).send("Email is Empty");
      return;
    }
    if (!name) {
      res.status(400).send("name is Empty");
      return;
    }
    if (!message) {
      res.status(400).send("Message is Empty");
      return;
    }

    //email check
    let emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let IsValidEmail = emailRegex.test(email);

    //if the email is not valid return error
    if (!IsValidEmail) {
      res.status(400).send("Invalid Email Address");
      return;
    }

    const mailOptions = {
      from: "Daniel Albert <danielalbert3377@gmail.com>",
      to: email,
      subject: "Thank you for contacting us",
      html: `<h1 style="font-size: 20px;">Thank you for contacting us</h1>
                <br />
                <p>We will get back to you as soon as possible.</p>
                <img style="width:300px;" src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />
                <br/>
                <p>From Daniel Albert</p>
            `,
    };

    const mailOptionsForDan = {
      from: "Daniel Albert <danielalbert3377@gmail.com>",
      to: `${process.env.EMAIL}`,
      subject: `Trades System Message`,
      html: `<p>You have a new message from ${name}</p>
                    <p>
                    email: ${email}
                    message: ${message}
                    </p>
                    `,
    };

    await transporter.sendMail(mailOptions).catch((error) => {
      return res.status(500).send(
        JSON.stringify({
          message: "An error occured could not send email to website uer",
          success: false,
          error: error,
        })
      );
    });

    await transporter.sendMail(mailOptionsForDan).catch((error) => {
      return res.status(500).send(
        JSON.stringify({
          message: "An error occured could not send email to owner",
          success: false,
          error: error,
        })
      );
    });

    return res.status(200).json({
      message: "messages sent to user and website owner",
      success: true,
    });
  }
};

exports.submitContactForm = onRequest(
  { region: "australia-southeast1" },
  handler
);
