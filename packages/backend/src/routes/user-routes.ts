import express from "express";
import { register, login } from "../services/user-services";

const router = express.Router();

router.post("/register", (req, res) => {
  register(req.body.name, req.body.email, req.body.password)
    .then((user) => res.status(201).send({ user }))
    .catch((error) => res.status(500).send({ error }));
});

router.post("/login", (req, res) => {
  login(req.body.email, req.body.password)
    .then((token) => res.status(200).send({ token }))
    .catch((error) => res.status(500).send({ error }));
});

export default router;
