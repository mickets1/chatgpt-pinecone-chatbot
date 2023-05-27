/* eslint-disable jsdoc/require-jsdoc */
import { GPTController } from '../controllers/gpt-controller'

describe('TC2 Blika specific tests', () => {
  let gptController

  beforeAll(() => {
    require('dotenv').config()
    gptController = new GPTController()
  })

  test('TC2.1 AI should be able to answer Blika specific questions - ', async () => {
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
})
