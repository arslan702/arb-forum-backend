const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');

const UsersModal = db.users;

const JWT_SECRET="myjwtsecret"
exports.registerUser = async (req, res) => {
  console.log("data..", req.body);
  try {
    const existingUser = await UsersModal.findOne({ where: { email: req.body.email} });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }
    const userImage = req.file;

    // Process other form data
    const { 
        firstName,
        familyName,
        email,
        phone,
        userName,
        password
    } = req.body;
    const newUser = await UsersModal.create({
        firstName,
        familyName,
        email,
        phone,
        userName,
        picture: userImage?.filename,
        password,
      });
  
    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(password, salt);
    const userAuth = await newUser.save();

    // Attach the userImage field to the userData object
    const token = jwt.sign(
      {
        id: userAuth?.id,
        email: userAuth?.email,
      },
      JWT_SECRET
    );
    res.status(201).json({
        message: "User created successfully.",
        user: {
          id: userAuth.id,
          email: userAuth.email,
          firstName,
          familyName,
          userName,
          picture: userAuth?.picture,
        },
        token,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Unable to contact",
        message: error,
        isSuccessfull: false,
      });
  }
};

exports.login = (req, res) => {
    const { email, password } = req.body;
  
    UsersModal.findOne({
      where: { email },
    })
      .then((user) => {
        console.log("user", user);
  
        // If user not found, return error message
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials." });
        }
        // Check password 
        return bcrypt.compare(password, user.password).then((passwordMatches) => {
          console.log(user.password, password, passwordMatches);
  
          if (!passwordMatches) {
            return res.status(401).json({ error: "Invalid credentials." });
          }
  
          // Generate JWT token and return success message
          const token = jwt.sign({ id: user.id }, JWT_SECRET);
  
          res.status(201).json({
            message: "User created successfully",
            user: {
                id: user?.id,
                email: user?.email,
                firstName: user?.firstName,
                familyName: user?.familyName,
                userName: user?.userName,
                phone: user?.phone,
                picture: user?.picture,
            },
            token,
          })
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
      });
  };

  exports.updateUserProfile = async (req, res) => {
    const { userId } = req.params; // Assuming userId is part of the URL parameters
    const { firstName, familyName, email, phone, userName, password } = req.body;
    console.log(req.body)
    try {
      const user = await UsersModal.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (req.file) {
        if (user.picture) {
          const previousImagePath = path.join(__dirname,'../uploads/', user.picture);
          // await fs.unlink(previousImagePath);
          try {
            await fs.unlink(previousImagePath, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('File deleted successfully');
            });
            console.log(`Previous image deleted: ${previousImagePath}`);
          } catch (unlinkError) {
            console.error(`Error deleting previous image: ${unlinkError.message}`);
          }
        }
  
        user.picture = req.file.filename;
      }
  
      user.firstName = firstName;
      user.familyName = familyName;
      user.email = email;
      user.phone = phone;
      user.userName = userName;
  
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);
      }
  
      await user.save();
  
      res.status(200).json({
        message: 'User profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          familyName: user.familyName,
          userName: user.userName,
          picture: user.picture, // Include the profile picture field
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Unable to update user profile',
        message: error.message,
        isSuccessfull: false,
      });
    }
  };

  exports.getSingleUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await UsersModal.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
        res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Unable to get user',
        message: error.message,
        isSuccessfull: false,
      });
    }
  };

  exports.updatePassword = async (req, res) => {
  
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await UsersModal.findOne({ where: { email } });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Hash the new password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  };