import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { SessionEntity } from "./entities/session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([SessionEntity])],
    controllers: [SessionsController],
    providers: [SessionsService]
})
export class SessionsModule {}
