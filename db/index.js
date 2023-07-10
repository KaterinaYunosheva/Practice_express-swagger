import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// путь к текущей директории
const __dirname = dirname(fileURLToPath(import.meta.url))

// путь к файлу с фиктивными данными
const file = join(__dirname, 'data.json')

const adapter = new JSONFile(file)
const defaultData = { posts: [] }
const db = new Low(adapter, defaultData)

export default db