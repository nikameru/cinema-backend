import { Injectable } from "@nestjs/common";
import * as qrcode from "qrcode";
import * as canvas from "canvas";
import * as fs from "fs";
import { OrdersService } from "../orders.service";
import { OrderEntity } from "../entities/order.entity";
import * as PDFDocument from "pdfkit";

@Injectable()
export class TicketsService {
    constructor(private readonly ordersService: OrdersService) {}

    async getGeneratedPdfFilepath(orderId: number): Promise<string> {
        const order = await this.ordersService.findOne({ id: orderId });

        const filepath = this.getTicketsFilepathFor(orderId);
        if (!fs.existsSync(filepath)) {
            await this.generateTicketsPdf(order);
        }

        return filepath;
    }

    private async generateTicketsPdf(order: OrderEntity) {
        const filmName = order.session.film.title;
        const roomNumber = order.session.roomId;
        const seatNumber = order.seatIds;
        const sessionDate = order.session.date;
        const sessionTime =
            sessionDate.getHours().toString().padStart(2, "0") +
            ":" +
            sessionDate.getMinutes().toString().padStart(2, "0");

        const ticketData = {
            film: filmName,
            room: roomNumber,
            seat: seatNumber,
            date: sessionDate,
            time: sessionTime
        };

        const baseTicketCanvas = canvas.createCanvas(800, 300);

        const pdf = new PDFDocument({
            size: [baseTicketCanvas.width, baseTicketCanvas.height]
        });
        const pdfFilename = this.getTicketsFilepathFor(order.id);
        const writeStream = fs.createWriteStream(pdfFilename);
        pdf.pipe(writeStream);

        const ctx = baseTicketCanvas.getContext("2d");

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, baseTicketCanvas.width, baseTicketCanvas.height);

        ctx.fillStyle = "rgba(247, 127, 0, 0.3)";
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * baseTicketCanvas.width;
            const y = Math.random() * baseTicketCanvas.height;
            this.drawStar(ctx, x, y, 5, 10, 5);
        }

        ctx.fillStyle = "#f77f00";
        ctx.fillRect(0, 0, baseTicketCanvas.width, 70);

        this.drawDecorativeLines(
            ctx,
            baseTicketCanvas.width,
            baseTicketCanvas.height
        );

        ctx.save();
        ctx.translate(baseTicketCanvas.width - 320, 150);
        ctx.scale(1.5, 1.5);
        this.drawProjector(ctx);
        ctx.restore();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = '34px "Segoe UI"';
        ctx.fillText("CINEMA TICKET X4LBA", 120, 45);

        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; i < 5; i++) {
            this.drawStar(
                ctx,
                baseTicketCanvas.width - 150 + i * 25,
                35,
                5,
                10,
                5
            );
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.font = 'bold 24px "Segoe UI"';
        ctx.fillText(`Film: ${ticketData.film}`, 30, 100);

        ctx.font = '22px "Segoe UI"';
        const date = new Date(ticketData.date);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric"
        };
        const formattedDate = date.toLocaleDateString("en-EN", options);
        ctx.fillText(`Date: ${formattedDate}`, 30, 140);
        ctx.fillText(`Time: ${ticketData.time}`, 30, 180);
        ctx.fillText(`Cinema hall: ${ticketData.room}`, 30, 220);

        const qrImageUrl = await qrcode.toDataURL(JSON.stringify(ticketData));
        const qrImage = await canvas.loadImage(qrImageUrl);
        ctx.drawImage(qrImage, baseTicketCanvas.width - 180, 100, 150, 150);

        let i = 0;
        for (const seatId of ticketData.seat) {
            const ticketCanvas = canvas.createCanvas(800, 300);
            const ticketCtx = ticketCanvas.getContext("2d");
            ticketCtx.drawImage(baseTicketCanvas, 0, 0);

            ticketCtx.fillStyle = "#FFFFFF";
            ticketCtx.font = '22px "Segoe UI"';
            ticketCtx.fillText(`Seat: ${seatId}`, 30, 260);

            const imgBuffer = ticketCanvas.toBuffer("image/jpeg");
            if (i !== 0) {
                pdf.addPage();
            }
            pdf.image(imgBuffer, 0, 0, {
                width: ticketCanvas.width,
                height: ticketCanvas.height
            });

            console.log(`Finishing ticket ${++i}/${ticketData.seat.length}`);
        }

        pdf.end();
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

    private getTicketsFilepathFor(orderId: number) {
        return `tickets_${orderId}.pdf`;
    }
}
