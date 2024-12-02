import { OneToMany, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { SessionEntity } from "src/sessions/entities/session.entity";

@Entity({ name: "rooms" })
export class RoomEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => SessionEntity, (session) => session.room)
    sessions: SessionEntity[];
}
