import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "films" })
export class FilmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    releaseDate: Date;

    @Column()
    genre: string;

    @Column()
    rating: number;

    @Column()
    cast: string;

    @Column()
    duration: string;
}
