import '@fastify/session'

declare module '@fastify/session' {
  interface FastifySessionObject {
    sessionId?: string;
  }
}