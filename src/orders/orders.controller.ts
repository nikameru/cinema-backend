import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Controller("orders")
@UseGuards(JwtGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post("reserve")
    createReservation(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createReservation(createOrderDto);
    }

    @Post()
    createOrder(@Req() request) {
        console.log(request.user);
        return this.ordersService.createOrder(request.user.sub);
    }

    @Get()
    findAll() {
        return this.ordersService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.ordersService.findOne({ id: +id });
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.update(+id, updateOrderDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.ordersService.remove(+id);
    }
}
