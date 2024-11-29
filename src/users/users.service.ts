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

    async findAll() {
        return await this.userRepository.find();
    }

    async findOne(where: FindOptionsWhere<UserEntity>) {
        return await this.userRepository.findOneBy(where);
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return await this.userRepository.update(id, updateUserDto);
    }

    async remove(id: number) {
        return await this.userRepository.delete(id);
    }
}
