import {AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild} from "@angular/core";
import {CreateModel} from "../create-model.model";
import {Subject} from "rxjs";

@Component({
  selector: "jnet-activation-function",
  templateUrl: "./activation-function.component.html",
  styleUrls: ["./activation-function.component.scss"]
})
export class ActivationFunctionComponent implements OnInit, AfterViewInit {
  @ViewChild("sigmoid") private readonly sigmoid!: ElementRef<HTMLCanvasElement>
  @ViewChild("relu") private readonly relu!: ElementRef<HTMLCanvasElement>
  @ViewChild("tanh") private readonly tanh!: ElementRef<HTMLCanvasElement>
  @ViewChild("linear") private readonly linear!: ElementRef<HTMLCanvasElement>
  @ViewChild("noop") private readonly noop!: ElementRef<HTMLCanvasElement>

  @Input() model!: CreateModel;

  @Output() changed: Subject<void> = new Subject<void>();

  public readonly width: number = 100;
  public readonly height: number = this.width;

  public constructor() {
  }

  public ngOnInit(): void {
    this.changed.next();
  }

  public ngAfterViewInit(): void {
    this.drawActivationFunctions();
  }

  public canvas(id: string): HTMLCanvasElement {
    switch (id) {
      case "sigmoid":
        return this.sigmoid.nativeElement;
      case "relu":
        return this.relu.nativeElement;
      case "tanh":
        return this.tanh.nativeElement;
      case "linear":
        return this.linear.nativeElement;
      case "noop":
        return this.noop.nativeElement;
      default:
        throw new Error(`${id} not a valid canvas`);
    }
  }

  public ctx(id: string): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = this.canvas(id).getContext("2d");
    if (!ctx) {
      throw new Error("ctx is null")
    }
    return ctx;
  }

  public activationFunctionChanged(): void {
    this.changed.next();
  }

  public drawActivationFunctions(): void {
    this.drawSigmoid();
    this.drawRelu();
    this.drawTanh();
    this.drawLinear();
    this.drawNoop();
  }

  public drawSigmoid(): void {
    const ctx = this.ctx("sigmoid");
    this.drawGrid(ctx);
    ctx.strokeStyle = "red";
    const sigmoid: (x: number) => number = (x: number): number => {
      return 1 / (1 + Math.exp(-x));
    }
    ctx.beginPath();
    for (let i: number = 0; i < this.width; i++) {
      const v: number = sigmoid((i - this.width / 2) / (this.width / 10));
      ctx.lineTo(i, -(v * this.height * 0.9) + this.height * 0.95);
    }
    ctx.stroke();
  }

  public drawRelu(): void {
    const ctx = this.ctx("relu");
    this.drawGrid(ctx);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width / 2, this.height / 2);
    ctx.lineTo(this.width, 0);
    ctx.stroke();
  }

  public drawTanh(): void {
    const ctx = this.ctx("tanh");
    this.drawGrid(ctx);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    for (let i: number = 0; i < this.width; i++) {
      const v: number = Math.tanh((i - this.width / 2) / (this.width / 10));
      ctx.lineTo(i, -(v * this.height / 2 * 0.9) + this.height / 2);
    }
    ctx.stroke();

  }

  public drawLinear(): void {
    const ctx = this.ctx("linear");
    this.drawGrid(ctx);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(this.width, 0);
    ctx.stroke();
  }

  public drawNoop(): void {
    const ctx = this.ctx("noop");
    this.drawGrid(ctx);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.stroke();
  }

  public drawGrid(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2);
    ctx.lineTo(this.width, this.height / 2);
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(this.width / 2, this.height);
    ctx.stroke();
    ctx.moveTo(0, 0);
  }
}
