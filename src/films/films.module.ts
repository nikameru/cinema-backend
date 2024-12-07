import { Module } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { FilmsController } from "./films.controller";
import { FilmEntity } from "./entities/film.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([FilmEntity]), JwtModule],
    controllers: [FilmsController],
    providers: [FilmsService],
    exports: [FilmsService]
})
export class FilmsModule {}
