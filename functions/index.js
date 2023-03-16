// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const contactUsFormModule = require('./contactForm.js');

exports.submitContactUsForm = functions
    .region('australia-southeast1')
    .https.onRequest((req, res) => contactUsFormModule.handler(req, res));