
const nodemailer = require('nodemailer');
//todo add allowed origins
//todo add security
const cors = require('cors')({ origin: true, allowedHeaders: "POST" });

let transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`
    }
});


exports.handler = async (req, res) => {

    // Check for POST request
    if (req.method !== "POST") {
        res.status(400).send('Please send a POST request');
        return;
    }
    
    //get the email and message from the request
    const { email, message, name } = req.body;

    if (!email) {
        res.status(400).send('Email is Empty')
        return;
    }
    if (!name) {
        res.status(400).send('name is Empty')
        return;
    }
    if (!message) {
        res.status(400).send('Message is Empty')
        return;
    }

    //email check
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    let IsValidEmail = emailRegex.test(email);

    //if the email is not valid return error
    if (!IsValidEmail) {
        res.status(400).send('Invalid Email Address')
        return;
    }

    cors(req, res, async () => {

        const mailOptions = {
            from: 'Ange <ange@ajmhomeservice.com>',
            to: email,
            subject: 'Thank you for contacting AJM Home Services',
            html: `<h1 style="font-size: 20px;">Thank you for contacting us</h1>
                <br />
                <p>We will get back to you as soon as possible.</p>
                <img style="width:300px;" src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" />
                <br/>
                <p>From Ange</p>
                <strong>AJM Home Services</strong>
                <p>Director of things</p>
            `
        };

        const mailOptionsForAJM = {
            from: 'Ange <ange@ajmhomeservice.com>',
            to: `${process.env.EMAIL}`,
            subject:`AJM Home Services Message`,
            html: `<p>You have a new message from ${name}</p>
                    <br/>
                    <p>message: ${message}</p>
                    `
        }

        await transporter.sendMail(mailOptions)
            .catch((error) => {
                return res.status(500)
                    .send(JSON.stringify({
                        message: "An error occured could not send email to website uer",
                        success: false,
                        error: error
                    }));
            });
        
        await transporter.sendMail(mailOptionsForAJM)
            .catch((error) => {
                return res.status(500)
                    .send(JSON.stringify({
                        message: "An error occured could not send email to owner",
                        success: false,
                        error: error
                    }));
            });
        
        return res.send(
            JSON.stringify({
                message: "messages sent to user and website owner",
                success:true
        }))
    });
};