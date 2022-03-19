import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from '@nestjs/config';
import { envConfigBuild } from '../config/envConfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/typeorm.config.service';
import { AuthModule } from '../common/auth/auth.module';
import { AuthJWT } from '../common/jwt/jwt.guard';
import { AuthConfig } from '../config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfigBuild],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthJWT, AuthConfig],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthJWT).forRoutes(AppController);
  }
}
