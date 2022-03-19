import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class TypeOrmConfigService {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get('database.host'),
      port: 5432,
      database: this.config.get('database.name'),
      username: this.config.get('database.username'),
      password: this.config.get('database.password'),
      entities: [CommentEntity, PostEntity],
      synchronize: true,
    };
  }
}
