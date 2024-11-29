import { OmitType } from "@nestjs/mapped-types";
import { SessionDto } from "./session.dto";

export class CreateSessionDto extends OmitType(SessionDto, ["id"] as const) {}
