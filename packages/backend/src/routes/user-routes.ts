import express from "express";
import { register } from "../services/user-services";

const router = express.Router();

router.post("/", (req, res) => {
  register(req.body.name, req.body.email, req.body.password)
    .then((user) => res.status(201).send(user))
    .catch((error) => res.status(500).send(error));
});

export default router;
