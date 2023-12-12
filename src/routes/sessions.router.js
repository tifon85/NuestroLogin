
import { Router } from "express";
import { SessionManager } from '../Dao/managerDB/SessionManagerMongo.js'

const sessionRouter = Router();

const sessionManager = new SessionManager()

sessionRouter.get('/', (req, res) => {
    if (!req.session.counter) {
      req.session.counter = 1
      req.session.name = req.query.name
  
      return res.status(200).json(`Bienvenido ${req.session.name}`)
    } else {
      req.session.counter++
  
      return res.status(200).json(`${req.session.name} has visitado la página ${req.session.counter} veces`)
    }
  })
  
  sessionRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    try {
      const createdUser = await sessionManager.createUser(req.body);
      res.status(200).json({ message: "User created", user: createdUser });
    } catch (error) {
      res.status(500).json({ error });
    }
  })
  
  sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    try {
      const user = await sessionManager.getUserByEmail(email);
      if (!user) {
        return res.redirect("/register");
      }
      const isPasswordValid = password === user.password;
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password incorrecta" });
      }
      const sessionInfo =
        email === "adminCoder@coder.com" && password === "adminCod3r123"
          ? { email, first_name: user.first_name, isAdmin: true }
          : { email, first_name: user.first_name, isAdmin: false };
      req.session.user = sessionInfo;
      res.redirect("/profile");
    } catch (error) {
      res.status(500).json({ error });
    }

  })

  router.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });
  
  module.exports = sessionRouter