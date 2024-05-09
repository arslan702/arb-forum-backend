
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
  
//   exports.verifyEmail = (req, res) => {
//       const { code } = req.body;
      
//       const isCodeValid = verificationCodes.includes(parseInt(code));
  
//     if (isCodeValid) {
//       res.status(200).json({ status: 'verified' });
//     } else {
//       res.status(400).json({ status: 'failed' });
//     }
  
//     }
exports.verifyEmail = (req, res) => {
    try {
      const { code } = req.body;
  
      // Assuming verificationCodes is an array containing valid codes
      const isCodeValid = verificationCodes.includes(parseInt(code));
  
      if (isCodeValid) {
        res.status(200).json({ status: 'verified' });
      } else {
        res.status(400).json({ status: 'failed' });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
  };
  