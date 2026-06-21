import express from "express";
import {
  addUser,
  getAllUsers,
  getUser,
  editUser,
  removeUser,
  subscribeAgency,
  unsubscribeAgency,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/api/users", addUser);
router.get("/api/users", getAllUsers);
router.get("/api/users/:id", getUser);
router.put("/api/users/:id", editUser);
router.delete("/api/users/:id", removeUser);
router.post("/api/users/:buyerId/follow/:agencyId", subscribeAgency);
router.post("/api/users/:buyerId/unfollow/:agencyId", unsubscribeAgency);

export default router;
