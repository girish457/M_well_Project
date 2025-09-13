import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'user-data')
const WELCOMED_FILE = path.join(DATA_DIR, 'welcomed.json')
const EMAIL_LOG = path.join(DATA_DIR, 'emails.log')

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

const readWelcomedSet = (): Set<string> => {
  ensureDataDir()
  if (!fs.existsSync(WELCOMED_FILE)) {
    fs.writeFileSync(WELCOMED_FILE, JSON.stringify([]))
  }
  try {
    const raw = fs.readFileSync(WELCOMED_FILE, 'utf8')
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set<string>()
  }
}

const writeWelcomedSet = (set: Set<string>) => {
  ensureDataDir()
  fs.writeFileSync(WELCOMED_FILE, JSON.stringify(Array.from(set), null, 2))
}

const appendEmailLog = (email: string, subject: string, body: string) => {
  ensureDataDir()
  const line = `[${new Date().toISOString()}] to=${email} subject="${subject}" body="${body.replace(/\n/g, ' ')}"\n`
  fs.appendFileSync(EMAIL_LOG, line)
}

export const sendWelcomeEmailIfFirst = (email: string) => {
  const welcomed = readWelcomedSet()
  if (welcomed.has(email)) return false
  const subject = 'Welcome to M-Well family! Your signup/login is successful.'
  const body = 'Welcome to M-Well family! Your signup/login is successful.'
  // Simulate email send by logging to file
  appendEmailLog(email, subject, body)
  welcomed.add(email)
  writeWelcomedSet(welcomed)
  return true
}


