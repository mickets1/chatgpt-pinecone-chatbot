/* eslint-disable jsdoc/require-jsdoc */
import { PineconeClient } from '@pinecone-database/pinecone'
import { Openai } from './openai.js'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()

export class PineconeController {
  constructor () {
    this.pinecone = new PineconeClient()
  }

  async init () {
    try {
      this.pinecone.projectName = ''

      await this.pinecone.init({
        environment: process.env.PINECONE_ENV,
        apiKey: process.env.PINECONE_API_KEY
      })

      const indexesList = await this.pinecone.listIndexes()

      // create index if it doesn't exist.
      if (indexesList.length === 0) {
        await this.pinecone.createIndex({
          createRequest: {
            name: 'chatbot',
            dimension: 1536
          }
        })
      }

      return
    } catch (err) {
      console.error(err)
    }
  }

  // IF [PineconeError: PineconeClient: Error calling upsert: PineconeError: PineconeClient: Error calling upsertRaw: FetchError: The request failed and the interceptors did not return an alternative response]
  // just wait and try again(takes a while to setup index).
  async upsert (data) {
    try {
      const index = this.pinecone.Index('chatbot')

      const embedding = await this.createEmbedding(data)

      const upsertRequest = {
        vectors: [
          {
            id: uuidv4(),
            values: embedding,
            metadata: {
              title: data
            }
          }
        ]
      }

      const upsertResponse = await index.upsert({ upsertRequest })

      // ex: { upsertedCount: 1 }
      console.log(upsertResponse)

      return upsertResponse
    } catch (err) {
      console.error(err)
    }
  }

  async query (question) {
    try {
      const embed = await this.createEmbedding(question)

      const index = this.pinecone.Index('chatbot')
      const queryRequest = {
        vector: embed,
        topK: 10,
        includeValues: false,
        includeMetadata: true
      }

      const response = await index.query({ queryRequest })
      // console.log(response.matches[0].metadata)
      return { data: response }
    } catch (err) {
      console.error()
    }
  }

  async createEmbedding (query) {
    const openai = Openai.getInstance()
    const embedding = await openai.openaiObj.createEmbedding({
      input: query,
      model: 'text-embedding-ada-002'
    })
    const response = embedding.data.data[0].embedding

    return response
  }
}
