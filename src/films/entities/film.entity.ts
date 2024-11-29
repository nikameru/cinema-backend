import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "films" })
export class FilmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    title: string;

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
}
