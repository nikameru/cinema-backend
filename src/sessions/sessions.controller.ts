import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query
} from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { GetCurrentSessionsDto } from "./dto/get-current-sessions.dto";

@Controller("sessions")
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) {}

    @Post()
    create(@Body() createSessionDto: CreateSessionDto) {
        return this.sessionsService.create(createSessionDto);
    }

    @Get("current")
    findCurrent(@Query() getCurrentSessionsDto: GetCurrentSessionsDto) {
        return this.sessionsService.findCurrent(
            getCurrentSessionsDto.daysOffset
        );
    }

    // For debug
    @Get("all")
    findAll() {
        return this.sessionsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.sessionsService.findOne({ id });
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateSessionDto: UpdateSessionDto
    ) {
        return this.sessionsService.update(+id, updateSessionDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.sessionsService.remove(+id);
    }
}
