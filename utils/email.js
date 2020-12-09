const nodemailer = require('nodemailer');


module.exports = class Email {
    constructor(user,html) {
      this.to = user.email;
      this.firstName = user.name.split(' ')[0];
      this.from = `Shunya Iida <${process.env.EMAIL_FROM}>`;
      this.html = html
    }
  
    newTransport() {
      if (process.env.NODE_ENV === 'production') {
        // Sendgrid
        return nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
      }
  
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
  
    // Send the actual email
    async send(subject) {
     

      // Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html: this.html
      };
  
      // Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    }
  
    async sendWelcome() {
      await this.send('Welcome to Online pal!');
    }
  
    async sendPasswordReset() {
      await this.send(
        'Your password reset token (valid for only 10 minutes)'
      );
    }
  };