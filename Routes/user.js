const express = require('express');

const router = express.Router();



const {
  handleGetAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  postUserById,
  getUserByIdOnlyName,
  getlog,
  uploadFile,
} = require("../controllers/user");




router.get("/api/log", getlog);

router.get("/api", handleGetAllUser);

router.get("/", getUserByIdOnlyName);

router.route("/:id").get(getUserById);

router.patch("/:id", updateUserById);

router.delete("/:id", deleteUserById);

router.post("/", postUserById);










router.post("/upload", uploadFile);

module.exports = router;