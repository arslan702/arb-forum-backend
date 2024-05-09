const nodemailer = require('nodemailer');

const verificationCodes = [
    7581, 3876, 7333, 7391, 2939,
    1572, 5507, 6408, 7758, 1884,
    5983, 5906, 1723, 4308, 2189,
    7547, 1681, 3527, 8953, 3331,
    9443, 9840, 7444, 6933, 5257,
    4190, 9511, 8569, 2654, 3027,
    7943, 6785, 1614, 1746, 1123,
    9629, 6592, 6636, 4329, 5769,
    9833, 5057, 9860, 5825, 1787,
    3886, 7247, 8913, 3006, 4504
  ]

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 456,
    service: 'gmail',
    auth: {
      user: 'arslanra761@gmail.com',
      pass: 'tlxeymkfphowjqvr',
    },
  });
  
  exports.sendEmail = async(req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).end(); // Method Not Allowed
    }
  
    const { email } = req.body;
    const randomCodeIndex = Math.floor(Math.random() * verificationCodes.length);
    const randomCode = verificationCodes[randomCodeIndex];
  
    try {
      const info = await transporter.sendMail({
        from: 'arslanra761@gmail.com',
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${randomCode}`,
      });
  
      console.log('Email sent:', info);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  }
  