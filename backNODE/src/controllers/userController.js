import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const secretKey = "seuSegredoJWT";

export const registerUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Usuário já existe" });
      return;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = new User({ nome, email, senha: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Usuário não encontrado" });
      return;
    }

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      res.status(400).json({ message: "Senha incorreta" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      secretKey,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no login" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-senha");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
};
