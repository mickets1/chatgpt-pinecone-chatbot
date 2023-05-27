/* eslint-disable jsdoc/require-jsdoc */
import { GPTController } from '../controllers/gpt-controller'

describe('TC1 GPT-controller tests', () => {
  let gptController

  beforeAll(() => {
    require('dotenv').config()
    gptController = new GPTController()
  })

  test('TC1.1 ChatGPT should return a response', async () => {
    const req = {
      body: {
        question: 'write a short random text'
      }
    }

    const res = {
      json: response => {
        expect(response).toBeDefined()
        expect(typeof response).toBe('string')
      }
    }
    await gptController.chatGPT(req, res)
  }, 30_000) // set timeout to 30 sec

  test('TC1.2 ChatGPT requires a provided question', async () => {
    const req = {
      body: {
        // No question provided
      }
    }
    const res = {
      json: jest.fn()
    }
    const next = jest.fn()

    await gptController.checkQuestion(req, res, next)

    expect(res.json).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(expect.any(Error))
    expect(next.mock.calls[0][0].status).toBe(400)
  })

  test('TC1.3 index should return available endpoints', async () => {
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await gptController.index(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      endpoints: expect.any(Array)
    }))
  })

  test('TC1.4 newChat should reset message history', async () => {
    const req = {
      session: {
        messageHistory: [{ role: 'user', content: 'What is your name?' }]
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    }

    await gptController.newChat(req, res)

    expect(req.session.messageHistory).toBeNull()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith('New chat successfully created')
  })

  test('TC1.5 chatGPT should add user message to message history', async () => {
    const req = {
      body: {
        question: 'Can you help me find a good restaurant?'
      },
      session: {
        messageHistory: []
      }
    }
    const res = {
      json: jest.fn()
    }
    const next = jest.fn()

    await gptController.chatGPT(req, res, next)

    expect(req.session.messageHistory).toHaveLength(2)
    expect(req.session.messageHistory[1]).toEqual({
      role: 'user',
      content: 'Can you help me find a good restaurant?'
    })
  })
})
