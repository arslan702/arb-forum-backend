const db = require("../models");

const ContactsModal = db.contacts;

exports.addContact = async (req, res) => {
  console.log("data..", req.body);
  try {
    const newContact = await ContactsModal.create(req.body);
    res.status(200).json({ isSuccessfull: true });
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
