import { OneToMany, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SessionEntity } from "src/sessions/entities/session.entity";

@Entity({ name: "rooms" })
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => SessionEntity, (session) => session.room)
    sessions: SessionEntity[];
}
