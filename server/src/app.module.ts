import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { validateEnv } from './env.validation';

@Module({
  controllers: [],
  providers: [AppService, AppGateway],
  imports: [ConfigModule.forRoot({ validate: validateEnv })],
})
export class AppModule {}
