/* eslint-disable jsdoc/require-jsdoc */
import { Configuration, OpenAIApi } from 'openai'

/**
 * Singleton pattern for Openai's API
 *
 * @class PrivateOpenai
 */
class PrivateOpenai {
  constructor () {
    // INIT
    this.openaiObj = new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_KEY })
    )
  }
}

export class Openai {
  static getInstance () {
    if (!Openai.instance) {
      Openai.instance = new PrivateOpenai()
    }
    return Openai.instance
  }

  async setOpenai () {
    this.openaiObj = new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_KEY })
    )
  }
}
