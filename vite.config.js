import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import http from 'http'
import https from 'https'

function fetchFeedForDev(feedUrl, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error('Too many feed redirects'))
      return
    }

    const url = new URL(feedUrl)
    const client = url.protocol === 'http:' ? http : https

    const request = client.request(
      url,
      {
        headers: {
          accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
          'user-agent': 'Thinking Studio RSS Reader'
        },
        rejectUnauthorized: false
      },
      (response) => {
        const location = response.headers.location
        if ([301, 302, 303, 307, 308].includes(response.statusCode) && location) {
          response.resume()
          const nextUrl = new URL(location, feedUrl).toString()
          fetchFeedForDev(nextUrl, redirectCount + 1).then(resolve).catch(reject)
          return
        }

        let body = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', () => {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            body
          })
        })
      }
    )

    request.on('error', reject)
    request.setTimeout(20000, () => {
      request.destroy(new Error('Feed request timed out'))
    })
    request.end()
  })
}

function rssProxyPlugin() {
  return {
    name: 'thinking-studio-rss-proxy',
    configureServer(server) {
      server.middlewares.use('/rss-proxy', async (req, res) => {
        try {
          const requestUrl = new URL(req.url || '', 'http://localhost')
          const feedUrl = requestUrl.searchParams.get('url')

          if (!feedUrl || !/^https?:\/\//i.test(feedUrl)) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing or invalid feed URL' }))
            return
          }

          const response = await fetchFeedForDev(feedUrl)

          if (!response.ok) {
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: `Feed returned ${response.status}` }))
            return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(response.body)
        } catch (error) {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error.message }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), rssProxyPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
})
