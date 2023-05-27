import { PineconeController } from '../config/pinecone.js'
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', 'config/.env') })

async function splitTxtFile () {
  const path = dirname(fileURLToPath(import.meta.url))
  const filePath = join(path, 'qa-manual.txt')

  const data = await fs.promises.readFile(filePath, 'utf8')
  const split = data.split('----')

  return split
}

async function addFileToPinecone (filename) {
  try {
    const txtfile = await splitTxtFile(filename)

    const pinecone = new PineconeController()
    pinecone.projectName = ''
    await pinecone.init()

    for (const txtBlock of txtfile) {
      await pinecone.upsert(txtBlock)
    }
  } catch (err) {
    console.error(err)
  }
}

// Change filename if different.
await addFileToPinecone('qa-manual.txt')
