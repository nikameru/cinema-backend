import { Injectable } from "@nestjs/common";
import * as qrcode from "qrcode";
import * as canvas from "canvas";
import * as fs from "fs";
import { OrdersService } from "../orders.service";
import { OrderEntity } from "../entities/order.entity";
import * as path from "path";

@Injectable()
export class TicketsService {
    constructor(private readonly ordersService: OrdersService) {}

    async getTickets(orderId: number): Promise<string> {
        const order = await this.ordersService.findOne({ id: orderId });
        console.log(order);

        const filepath = this.getTicketFilepath(orderId, 1);
        if (!fs.existsSync(filepath)) {
            await this.generateTicket(order);
        }

        return filepath;
    }

    private async generateTicket(order: OrderEntity) {
        const filmName = order.session.film.title;
        const roomNumber = order.session.roomId;
        const seatNumber = order.seatIds;
        const currentDate = order.session.date;
        const sessionDate = `${currentDate.getFullYear() + 1}-${currentDate.getMonth()}-${currentDate.getDay()}`;
        const sessionTime = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

        const ticketData = {
            film: filmName,
            room: roomNumber,
            seat: seatNumber,
            date: sessionDate,
            time: sessionTime
        };

        const ticketCanvas = canvas.createCanvas(800, 300);
        const ctx = ticketCanvas.getContext("2d");

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, ticketCanvas.width, ticketCanvas.height);

        ctx.fillStyle = "rgba(247, 127, 0, 0.3)";
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * ticketCanvas.width;
            const y = Math.random() * ticketCanvas.height;
            this.drawStar(ctx, x, y, 5, 10, 5);
        }

        ctx.fillStyle = "#f77f00";
        ctx.fillRect(0, 0, ticketCanvas.width, 70);

        this.drawDecorativeLines(ctx, ticketCanvas.width, ticketCanvas.height);

        ctx.save();
        ctx.translate(ticketCanvas.width - 320, 150);
        ctx.scale(1.5, 1.5);
        this.drawProjector(ctx);
        ctx.restore();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = '34px "Segoe UI"';
        ctx.fillText("CINEMA TICKET X4LBA", 120, 45);

        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; i < 5; i++) {
            this.drawStar(ctx, ticketCanvas.width - 150 + i * 25, 35, 5, 10, 5);
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.font = 'bold 24px "Segoe UI"';
        ctx.fillText(`Фильм: ${ticketData.film}`, 30, 100);

        ctx.font = '22px "Segoe UI"';
        const date = new Date(ticketData.date);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        const formattedDate = date.toLocaleDateString("ru-RU", options);
        ctx.fillText(`Дата: ${formattedDate}`, 30, 140);
        ctx.fillText(`Время: ${ticketData.time}`, 30, 180);
        ctx.fillText(`Зал: ${ticketData.room}`, 30, 220);
        ctx.fillText(`Место: ${ticketData.seat}`, 30, 260);

        const qrImage = await qrcode.toDataURL(JSON.stringify(ticketData));
        const qrImg = await canvas.loadImage(qrImage);
        ctx.drawImage(qrImg, ticketCanvas.width - 180, 100, 150, 150);

        const filename = this.getTicketFilepath(order.id, 1);
        const out = fs.createWriteStream(filename);
        const stream = ticketCanvas.createJPEGStream({
            quality: 0.95,
            chromaSubsampling: true,
            progressive: true
        });

        stream.pipe(out);
    }

    private drawStar(
        ctx: any,
        cx: number,
        cy: number,
        spikes: number,
        outerRadius: number,
        innerRadius: number
    ) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    private drawProjector(ctx: any) {
        ctx.fillStyle = "#f77f00";

        // Верхние катушки
        ctx.beginPath();
        ctx.arc(-15, -20, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(15, -20, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(-25, -10, 50, 20);

        ctx.beginPath();
        ctx.moveTo(25, -10);
        ctx.lineTo(45, -15);
        ctx.lineTo(45, 15);
        ctx.lineTo(25, 10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(0, 10);
        ctx.lineTo(0, 45);

        ctx.moveTo(0, 35);
        ctx.lineTo(-25, 55);

        ctx.moveTo(0, 35);
        ctx.lineTo(25, 55);

        ctx.moveTo(-5, 35);
        ctx.lineTo(5, 35);

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#f77f00";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 35, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    private drawDecorativeLines(ctx: any, width: number, height: number) {
        ctx.strokeStyle = "#f77f00";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(width - 200, 0);
        ctx.lineTo(width - 200, height);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.strokeStyle = "rgba(247, 127, 0, 0.1)";
        ctx.lineWidth = 3;
        for (let i = 0; i < width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            for (let j = 0; j < height; j += 20) {
                ctx.lineTo(i + 10 * Math.sin(j / 20), j);
            }
            ctx.stroke();
        }
    }

    private getTicketFilepath(orderId: number, seat: number) {
        return path.resolve(__dirname, `ticket_${orderId}_${seat}.jpeg`);
    }
}
