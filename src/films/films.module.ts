import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { FilmEntity } from './entities/film.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity])],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
