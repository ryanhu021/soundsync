import express from "express";
import { register, login, logout } from "../services/user-services";
import { AuthRequest, auth } from "../util/auth";

const router = express.Router();

router.post("/register", (req, res) => {
  register(req.body.name, req.body.email, req.body.password)
    .then((cookie) => {
      res.header("Set-Cookie", cookie);
      res.status(201).send();
    })
    .catch((error) => res.status(500).send({ error }));
});

router.post("/login", (req, res) => {
  login(req.body.email, req.body.password)
    .then((cookie) => {
      res.header("Set-Cookie", cookie);
      res.status(200).send();
    })
    .catch((error) => res.status(500).send({ error }));
});

router.post("/logout", (req, res) => {
  logout().then((cookie) => {
    res.header("Set-Cookie", cookie);
    res.status(200).send();
  });
});

router.get("/check-auth", auth, (req: AuthRequest, res) => {
  res
    .status(200)
    .send({ user: { name: req.user?.name, email: req.user?.email } });
});

export default router;
