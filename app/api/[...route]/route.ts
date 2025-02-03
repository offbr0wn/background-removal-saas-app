import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')


function heello() {
  return {
    message: 'hello'
  }
}
app.get('/hello', (c) => {
  return c.json(heello(),200)
})

export const GET = handle(app)
