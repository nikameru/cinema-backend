import { Injectable } from "@nestjs/common";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { RoomEntity } from "./entities/room.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ) {}

    create(createRoomDto: CreateRoomDto) {
        return this.roomRepository.save(createRoomDto);
    }

    findAll() {
        return this.roomRepository.find();
    }

    findOne(id: number) {
        return this.roomRepository.findOneBy({ id });
    }

    update(id: number, updateRoomDto: UpdateRoomDto) {
        return this.roomRepository.update(id, updateRoomDto);
    }

    remove(id: number) {
        return this.roomRepository.delete(id);
    }
}
