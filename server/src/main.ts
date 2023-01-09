import fastifyCors from '@fastify/cors';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { fastifyHelmet } from '@fastify/helmet';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true,
      ignoreTrailingSlash: true,
      disableRequestLogging: true,
    }),
  );

  // await app.register(fastifyExpress);

  // const signalingPath = '/signal';

  // app.use(signalingPath, (req, res) => {
  //   console.log('asdas');
  //   peerServer(req, res);
  // });
  // app.getHttpAdapter().use(signalingPath, peerServer);

  const configService: ConfigService = app.get(ConfigService);

  await app.register(fastifyCors, { credentials: true, origin: '*' });
  await app.register(fastifyHelmet, { contentSecurityPolicy: false });
  const server = await app.listen(configService.get<number>('SERVER_PORT'), '0.0.0.0');

  // const peerServer = PeerServer({ path: signalingPath });

  console.log(`server is running on: ${await app.getUrl()}`);
}
bootstrap();
