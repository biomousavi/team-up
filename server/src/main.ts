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
  const configService: ConfigService = app.get(ConfigService);

  await app.register(fastifyCors, { credentials: true, origin: '*' });
  await app.register(fastifyHelmet, { contentSecurityPolicy: false });
  await app.listen(configService.get<number>('SERVER_PORT'), '0.0.0.0');
  console.log(`server is running on: ${await app.getUrl()}`);
}
bootstrap();
