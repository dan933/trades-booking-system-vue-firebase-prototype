const nodemailer = require("nodemailer");

let generateBookingEmailData = (booking) => {
  //Number of hours category, hours, price, ect
  let serviceData = booking.services.map((service) => {
    return {
      name: service.selection.name,
      hours: service.hours,
      rate: service.selection.rate,
    };
  });

  let serviceHtml = "";
  serviceData.forEach((service, index) => {
    let color = "#fff";
    if (index % 2 === 0) {
      color = "#f2f2f2";
    }
    serviceHtml += `<tr style="background-color: ${color}">
    <td style="border: 1px solid #ddd; padding: 8px;">${service.name}</td>
    <td style="border: 1px solid #ddd; padding: 8px;">${service.hours}</td>
    <td style="border: 1px solid #ddd; padding: 8px;">$ ${service.rate}</td>
    </tr>`;
  });

  let total = serviceData.reduce((total, service) => {
    return total + service.hours * service.rate;
  }, 0);

  let gst = total * 0.1;
  let grandTotal = total + gst;

  let totalsHtml = `<tr>
  <td style="padding:8px"></td>
  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Total</strong></td>
  <td style="border: 1px solid #ddd; padding: 8px;">$ ${total}</td>
  </tr>
  <tr>
  <td style="padding:8px"></td>
  <td style="border: 1px solid #ddd; padding: 8px;"><strong>GST</strong></td>
  <td style="border: 1px solid #ddd; padding: 8px;">$ ${gst}</td>
  </tr>
  <tr>
  <td style="padding:8px"></td>
  <td style="border: 1px solid #ddd; padding: 8px;"><strong>Grand Total</strong></td>
  <td style="border: 1px solid #ddd; padding: 8px;">$ ${grandTotal}</td>
  </tr>`;
  serviceHtml += totalsHtml;

  let startTime = convertTo12HourTime(booking.startHour);
  let endTime = convertTo12HourTime(booking.endHour);

  let emailHTMl = `<h1 style="font-size: 20px;">Thank you for booking with AJM Home Services</h1>
  <br />
  <p>We have successfully booked your appointment for ${formatDate(
    booking.bookingDate
  )} from ${startTime} to ${endTime}. Here are the details:</p>
  <table style="font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%; max-width:900px; margin-left: auto; margin-right: auto;">
  <thead style="background-color: #04AA6D;">
      <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #04AA6D; color: white;">Service</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #04AA6D; color: white;">Hours</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #04AA6D; color: white;">Rate</th>
      </tr>
  </thead>
  <tbody>
      ${serviceHtml}
  </tbody>
</table>
<p>Please contact us if you have any questions or changes.</p>
<p>Best,</p>
<p>Your Service Provider AJM Home Services</p>`;

  return emailHTMl;
};

let convertTo12HourTime = (hour) => {
  // Ensure the hour is within the appropriate range
  if (hour < 0 || hour > 24) {
    return "Invalid hour. Please enter a value between 0 and 24.";
  }

  // Midnight is considered as '12 AM'
  if (hour == 0) {
    return "12:00 AM";
  }

  // Noon is '12 PM'
  else if (hour == 12) {
    return "12:00 PM";
  }

  // If the hour is less than 12, it's AM, otherwise it's PM
  else if (hour < 12) {
    return hour + " AM";
  } else {
    return hour - 12 + ":00 PM";
  }
};

exports.createBookingEmail = async (booking) => {
  try {
    //validate email
    let IsValidEmail = validateEmail(booking.email);

    if (!IsValidEmail)
      return {
        message: "Invalid Email Address",
        success: false,
      };

    //Create Email html
    let emailHtml = generateBookingEmailData(booking);

    //create transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
      },
    });
    const mailOptions = {
      from: "Ange <ange@ajmhomeservice.com>",
      to: booking.email,
      subject: "Booking Confirmation",
      html: emailHtml,
    };

    let startTime = convertTo12HourTime(booking.startHour);
    let endTime = convertTo12HourTime(booking.endHour);

    const mailOptionsForAJM = {
      from: "Ange <ange@ajmhomeservice.com>",
      to: `${process.env.EMAIL}`,
      subject: `New booking from ${booking.firstName}`,
      html: `<p>You have a new booking from ${booking.firstName}</p>
                  <p>
                  email: ${booking.email}
                  bookingDate: ${formatDate(booking.bookingDate)}
                  startHour: ${startTime}
                  endHour: ${endTime}
                  </p>
                  `,
    };
    await transporter.sendMail(mailOptions).catch((error) => {
      return {
        message: "An error occured could not send email to website uer",
        success: false,
        error: error,
      };
    });
    await transporter.sendMail(mailOptionsForAJM).catch((error) => {
      return {
        message: "An error occured could not send email to owner",
        success: false,
        error: error,
      };
    });

    return {
      message: "Email sent to user and website owner",
      success: true,
    };
  } catch (error) {
    functions.logger.error("Email Error", error);
    return {
      message: "Error Email Function",
      error: error,
      success: false,
    };
  }
};

//Helper functions
let validateEmail = (email) => {
  //email check
  let emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let IsValidEmail = emailRegex.test(email);

  return IsValidEmail;
};

function formatDate(date) {
  const d = new Date(date);
  let day = d.getDate();
  let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
  const year = d.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }

  return `${day}/${month}/${year}`;
}
