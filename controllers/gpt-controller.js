/* eslint-disable jsdoc/require-jsdoc */
import createError from 'http-errors'
import { Openai } from '../config/openai.js'

/**
 * GPT Controller
 */
export class GPTController {
  constructor (pineconeController) {
    this.pinecone = pineconeController
  }

  async index (req, res, next) {
    const endpoints = [
      {
        method: 'GET',
        url: '/',
        description: 'Retrieves information about available endpoints.'
      },
      {
        method: 'POST',
        url: '/newchat',
        description: 'Creates a new chat. Resets previous chat history.'
      },
      {
        method: 'POST',
        url: '/ask',
        description: 'Sends a question to an AI model and receives an answer.'
      }
    ]

    const response = {
      endpoints
    }

    res.status(200).json(response)
  }

  async checkQuestion (req, res, next) {
    if (!req.body.question) {
      next(createError(400, 'Response should contain question'))
    }
    next()
  }

  async newChat (req, res, next) {
    try {
      req.session.messageHistory = null
      res.status(200).send('New chat successfully created')
    } catch (err) {
      console.error()
    }
  }

  async chatGPT (req, res, next) {
    try {
      const openai = Openai.getInstance()

      if (!req.session.messageHistory) {
        req.session.messageHistory = []
      }
      if (req.session.messageHistory.length === 0) {
        req.session.messageHistory.push({
          role: 'system',
          content: 'You are a helpful assistant called Blika Bot.'
        })
      }

      if (req.body.question) {
        const res = await this.pinecone.query(req.body.question)

        console.log(res.data.matches[0])
        console.log(res.data.matches[0].metadata.content)

        const messageContent = `
          Answer the question as truthfully as possible with the help of the provided text. If the provided text does not provide any information say "I don't know".

          CONTEXT: ${res.data.matches[0].metadata.content}
          QUESTION: ${req.body.question}
        `
        req.session.messageHistory.push({ role: 'user', content: messageContent })
      }

      const chatGptResponse = await openai.openaiObj.createChatCompletion({
        model: process.env.MODEL,
        messages: req.session.messageHistory
      })

      let response = chatGptResponse.data.choices[0].message.content

      // Remove "I don't know." explanation.
      if (/^I don't know\./.test(response) && response.length > 13) { // Does not 100% solve the context/provided text problem.
        response = response.split('.')[0] + '.'
      }

      req.session.messageHistory.push({ role: 'assistant', content: response })

      return res.json(response)
    } catch (err) {
      console.error()
    }
  }
}
