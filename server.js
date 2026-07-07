import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import fs from 'fs'
import path from 'path'

const app = new Hono()

// 1. Inject global secure headers
app.use('*', secureHeaders())

// 2. Enable built-in CSRF protection
// By default, Hono's CSRF middleware checks the 'Origin' and 'Referer' headers 
// for state-changing requests (POST, PUT, DELETE) to block cross-site attacks.
app.use('*', csrf())

// Helper to serve the static login.html file
app.get('/login', (c) => {
  const html = fs.readFileSync(path.resolve('./login.html'), 'utf-8')
  return c.html(html)
})

// 3. Handle Login POST Request
app.post('/login', async (c) => {
  // Parse the incoming standard URL-encoded form data
  const body = await c.req.parseBody()
  const username = body.username
  const password = body.password

  // Hardcoded credentials for demonstration purposes
  if (username === 'admin' && password === 'password123') {
    return c.html('<h1>Login Successful! Welcome to your Hono dashboard.</h1>')
  }

  return c.html('<h1>Invalid credentials</h1><a href="/login">Try again</a>', 401)
})

// Start the Node.js server engine
serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server running on http://localhost:${info.port}/login`)
})

