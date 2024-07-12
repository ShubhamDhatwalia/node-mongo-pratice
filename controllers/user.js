
const Users = require("../models/user");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

async function handleGetAllUser(req, res) {
    const alldbUsers = await Users.find({});

    return res.status(200).json(alldbUsers);
}


async function getUserById(req, res) {
    const id = req.params.id;
    const user = await Users.findById(id);

    if (!user) {
      console.log(`No user Exists with ID: ${id}`);
      return res
        .status(400)
        .json({ status: "error", message: `No user exists with ID : ${id}` });
    }
    return res.json(user);
}


async function updateUserById(req, res) {
    const id = req.params.id; // Extract id from URL parameter

    // Find the user in the array by id
    const user = await Users.findByIdAndUpdate(id, { last_name: "Changed" });

    if (!user) {
      console.log(`No user Exists with ID: ${id}`);
      return res
        .status(400)
        .json({ status: "error", message: `No user exists with ID : ${id}` });
    }
    return res.status(200).json({ msg: "Updated successfully" });
}


async function deleteUserById(req, res) {
    const id = req.params.id;

    const user = await Users.findByIdAndDelete(id);

    if (!user) {
      console.log(`No user Exists with ID: ${id}`);
      return res
        .status(400)
        .json({ status: "error", message: `No user exists with ID : ${id}` });
    }
    return res.status(200).json({ msg: "Deleted successfully" });
}



async function postUserById(req, res) {
    const body = req.body;
    console.log(body);

    if (!body || Object.keys(body).length === 0) {
      console.log("No data provided for append");
      return res
        .status(400)
        .json({ status: "error", message: "No data provided for append" });
    }

    if (!body.email) {
      console.log("Email required");
      return res.json({ ms: "Email required" });
    }

    try {
      const existingUser = await Users.findOne({ email: body.email });
      console.log(existingUser);

      if (existingUser) {
        console.log(`${body.email} already exists`);
        return res
          .status(208)
          .json({ status: "error", message: "Email already exists" });
      }

      const result = await Users.create({
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        gender: body.gender,
        job_title: body.jobTitle,
      });

      console.log(result);
      return res.status(201).json({ msg: "success" });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to process request" });
    }
}


async function getUserByIdOnlyName(req, res) {
    const dbUsers = await Users.find({});

    const html = `
    <ul>
    ${dbUsers.map((user) => `<li>${user.first_name}</li>`).join("")}</ul>`;

    res.send(html);
}

async function getlog(req, res) {
  // const stream = fs.createReadStream("./task2.txt", "utf-8",);
  // stream.on("data", (chunks) => res.write(chunks));
  // stream.on("end", () => res.end());

  const stream = fs.createReadStream("./task2.txt", "utf-8");
  stream.pipe(res);

  // fs.readFile("./task2.txt", "UTF-8",(err, data) => {
  //   res.json({ data });
  // })
}




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const maxSize = 1 * 1000 * 1000; // 1 MB


const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Allowed file types
    let filetypes = /jpeg|jpg|png/;
    // Check MIME type
    let mimetype = filetypes.test(file.mimetype);
    // Check file extension
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Error: File upload only supports the following filetypes: jpeg, jpg, png"
        )
      );
    }
  },
}).single("profileImage");





async function uploadFile(req, res) {

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send("File size limit exceeded (1MB max)");
        }
        return res.status(500).send(err.message);
      } else if (err) {
        // Handle file type error
        if (err.message.startsWith("Error: File upload only supports")) {
          return res.status(400).send(err.message);
        }
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      // File upload was successful
      if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).send("Error: No file uploaded");
      }

      console.log("Uploaded file details:", req.file);

      // Redirect to the root route after sending the success response
      return res.redirect("/");
    });
}


module.exports = {
  handleGetAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  postUserById,
  getUserByIdOnlyName,
  getlog,
  uploadFile,
};