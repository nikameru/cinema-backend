import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards
} from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { GetCurrentSessionsDto } from "./dto/get-current-sessions.dto";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Controller("sessions")
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Post()
    @UseGuards(JwtGuard)
    create(@Body() createSessionDto: CreateSessionDto) {
        return this.sessionsService.create(createSessionDto);
    }

    @Get("current")
    findCurrent(@Query() getCurrentSessionsDto: GetCurrentSessionsDto) {
        return this.sessionsService.findCurrent(
            getCurrentSessionsDto.daysOffset
        );
    }

    @Get("all")
    @UseGuards(JwtGuard)
    findAll() {
        return this.sessionsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.sessionsService.findOne({ id });
    }

    @Patch(":id")
    @UseGuards(JwtGuard)
    update(
        @Param("id") id: string,
        @Body() updateSessionDto: UpdateSessionDto
    ) {
        return this.sessionsService.update(+id, updateSessionDto);
    }

    @Delete(":id")
    @UseGuards(JwtGuard)
    remove(@Param("id") id: string) {
        return this.sessionsService.remove(+id);
    }

    @Get(":id/occupied")
    async getOccupiedSeats(@Param("id") id: number) {
        return this.sessionsService.getOccupiedSeats(id);
    }
}
