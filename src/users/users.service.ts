import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async create(createUserDto: CreateUserDto) {
        const { password, ...data } = createUserDto;
        const user = this.userRepository.create(data);
        user.password = await bcrypt.hash(password, 10);

        return this.userRepository.save(user);
    }

    findAll() {
        return this.userRepository.find();
    }

    findOne(where: FindOptionsWhere<UserEntity>) {
        return this.userRepository.findOneBy(where);
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.userRepository.update(id, updateUserDto);
    }

    remove(id: number) {
        return this.userRepository.delete(id);
    }
}
