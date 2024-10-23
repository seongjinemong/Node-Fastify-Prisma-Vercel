import Fastify from 'fastify'

const app = Fastify({
  logger: true,
})

app.get('/', async (req,res) => {
  return res.status(200).type('json').send('Hello, World!')
})

export default async function handler(req, res) {
  await app.ready()
  app.server.emit('request', req, res)
}