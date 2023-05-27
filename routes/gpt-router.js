import express from 'express'
import { GPTController } from '../controllers/gpt-controller.js'

import { PineconeController } from '../config/pinecone.js'

export const router = express.Router()

const pineconeController = new PineconeController()
await pineconeController.init()

const gptController = new GPTController(pineconeController)

router.get('/', (req, res, next) => gptController.index(req, res, next))
router.post('/newchat', (req, res, next) => gptController.newChat(req, res, next))
router.post('/ask',
  (req, res, next) => gptController.checkQuestion(req, res, next),
  (req, res, next) => gptController.chatGPT(req, res, next)
)
