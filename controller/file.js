const { v4: uuid } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const nodemailer = require("nodemailer");
const fs = require("fs");
const File = require("../model/file");
const fileUpload = async (req, res) => {
  const { file } = req;
  console.log(file);
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    console.log("Uploading file to Cloudinary:", file.path);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      public_id: uuid(),
      folder: "uploads",
    });

    console.log(result);

    // Create a new File document using your Mongoose model
    const newFile = new File({
      filename: file.originalname,
      path: result.secure_url, // URL from Cloudinary
      size: file.size,
      uuid: uuid(), // Generate a new UUID
    });

    await newFile.save(); // Save the document to MongoDB
    fs.unlinkSync(file.path); // Remove the file from the server

    // Construct download link
    const downloadLink = `${req.protocol}://${req.get("host")}/files/${
      newFile.uuid
    }`;

    res.status(201).json({ downloadLink });
  } catch (error) {
    console.log(error, "error coming from cloudinary");
    res.status(500).json({ message: "Failed to upload file" });
  }
};

const getLink = async (req, res, next) => {
  const id = req.params.uuid;

  try {
    const file = await File.findOne({ uuid: id }).select("path");

    if (!file) {
      throw new Error("File not found");
    }

    res.status(200).json({ downloadLink: file.path });
  } catch (error) {
    next(error);
  }
};

const sendEmail = async (req, res, next) => {
  const { name, email, message, id } = req.body;

  const file = await File.findOne({ uuid: id }).select("path");

  if (!file) {
    return next({ message: "file not found invalid uuid" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: "Message from your Website",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Message from Your Website</h2>
       
        <p>${message}</p>
        <p><strong>Download Link:</strong></p>
        <p><a href="${file.path}" style="color: blue; text-decoration: underline;">Click here to download your file</a></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    next(res.json({ messgae: "error while sending email" }));
  }
};

const fileDownload = async (req, res) => {
  const id = req.params.uuid;

  try {
    const file = await File.findOne({ uuid: id }).select("path");

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Redirect to the Cloudinary URL
    res.redirect(file.path);
  } catch (error) {
    next(error);
  }
};

const fileController = {
  fileUpload,
  getLink,
  fileDownload,
  sendEmail,
};
module.exports = fileController;
