import { OneToMany, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { SessionEntity } from "src/sessions/entities/session.entity";

@Entity({ name: "rooms" })
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    seats: string;

    @OneToMany(() => SessionEntity, (session) => session.room)
    sessions: SessionEntity[];
}
