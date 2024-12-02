import { SessionEntity } from "src/sessions/entities/session.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    BaseEntity
} from "typeorm";

@Entity({ name: "films" })
export class FilmEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    title: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column({
        name: "cover_link"
    })
    coverLink: string;

    @Column({
        name: "release_date"
    })
    releaseDate: Date;

    @Column()
    genre: string;

    @Column({
        nullable: true
    })
    rating: number;

    @Column()
    cast: string;

    @Column()
    duration: string;

    @Column({
        name: "trailer_youtube_link"
    })
    trailerYoutubeLink: string;

    @OneToMany(() => SessionEntity, (session) => session.film)
    sessions: SessionEntity[];
}
