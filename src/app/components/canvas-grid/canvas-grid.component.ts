import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Output, ViewChild} from "@angular/core";
import {BehaviorSubject, debounceTime, fromEvent, pairwise, Subject, switchMap, takeUntil, tap} from "rxjs";
import {Grid} from "../../models/grid.model";
import {GridService} from "../../services/grid.service";

@Component({
  selector: "jnet-canvas-grid",
  templateUrl: "./canvas-grid.component.html",
  styleUrls: ["./canvas-grid.component.scss"]
})
export class CanvasGridComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() width!: number;
  @Input() height!: number;
  @Input() penSize!: number;

  @Input() gridRows!: number;
  @Input() gridColumns!: number;

  @Input() onReset!: Subject<void>;

  @ViewChild("canvas") private readonly _canvas!: ElementRef<HTMLCanvasElement>;

  @Output() state: BehaviorSubject<Grid> = new BehaviorSubject<Grid>(new Grid([]));

  public get canvas(): HTMLCanvasElement {
    if (!this._canvas) {
      throw new Error("no canvas")
    }
    return this._canvas.nativeElement
  }

  public get ctx(): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("context is null")
    }
    return ctx;
  }

  private _grid: Grid = new Grid([]);

  public get grid(): Grid {
    return this._grid;
  }

  public set grid(grid: Grid) {
    this._grid = grid;
    this.state.next(grid);
  }

  public radius: number = 0;

  public tileWidth: number = 0;
  public tileHeight: number = 0;

  public bad: boolean = false;
  public blank: boolean = true;

  private onDestroy: Subject<void> = new Subject<void>();

  public constructor(private gridSvc: GridService) {
  }

  public ngOnInit(): void {
    if (this.gridRows > this.width) {
      throw new Error("grid is smaller than canvas")
    }

    this.onReset.subscribe(() => this.clearGrid());
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }

  public ngAfterViewInit(): void {
    this.radius = this.penSize / 100 * this.canvas.width;

    this.tileWidth = this.width / this.gridColumns;
    this.tileHeight = this.height / this.gridRows;

    this.ctx.lineWidth = this.radius;
    this.ctx.lineCap = "round";
    this.ctx.strokeStyle = "black";

    setTimeout(() => {
      this.clearGrid();
    });

    this.captureEvents();
  }

  private captureEvents() {
    fromEvent(this.canvas, "mousedown")
      .pipe(
        switchMap((_) => {
          return fromEvent(this.canvas, "mousemove")
            .pipe(
              takeUntil(fromEvent(this.canvas, "mouseup")),
              takeUntil(fromEvent(this.canvas, "mouseleave")),
              pairwise(),
              tap((events: any) => {
                const rect = this.canvas.getBoundingClientRect();

                const prevPos = {
                  x: events[0].clientX - rect.left,
                  y: events[0].clientY - rect.top,
                }

                const currentPos = {
                  x: events[1].clientX - rect.left,
                  y: events[1].clientY - rect.top,
                }

                if (currentPos.x < Math.ceil(this.radius / 2) || currentPos.x > this.canvas.width - Math.ceil(this.radius / 2) ||
                  currentPos.y < Math.ceil(this.radius / 2) || currentPos.y > this.canvas.height - Math.ceil(this.radius / 2)) {
                  this.bad = true;
                }

                this.drawOnCanvas(prevPos, currentPos);
              }),
              debounceTime(0),
              tap((_: any) => {
                this.gridify();
              })
            )
        })
      )
      .subscribe();
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!prevPos) {
      return;
    }

    this.blank = false;

    this.ctx.beginPath();
    this.ctx.strokeStyle = "black"
    this.ctx.moveTo(prevPos.x, prevPos.y);
    this.ctx.lineTo(currentPos.x, currentPos.y)
    this.ctx.stroke();
  }

  public getAverageRGBA(imageData: ImageData): RGBA {
    const rgba: RGBA = {r: 0, g: 0, b: 0, a: 0};

    const numPixels = imageData.data.length / 4;
    for (let i: number = 0; i < numPixels * 4; i += 4) {
      rgba.r += imageData.data[i];
      rgba.g += imageData.data[i + 1];
      rgba.b += imageData.data[i + 2];
      rgba.a += imageData.data[i + 3];
    }
    rgba.r = ~~(rgba.r / numPixels);
    rgba.g = ~~(rgba.g / numPixels);
    rgba.b = ~~(rgba.b / numPixels);
    rgba.a = ~~(rgba.a / numPixels);

    return rgba;
  }

  // NOTE(justin): This function assumes all pixels are set to the same value because its in greyscale,
  // and this only returns the "r" channel.
  public getAverageGreyscale(imageData: ImageData): number {
    const rgba: RGBA = this.getAverageRGBA(imageData);
    return rgba.r;
  }

  // TODO(justin): Assumption is that canvas is square.
  public center(): ImageData {
    const originalImageData: ImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const pixelsPerLine: number = this.width * 4;

    const lines: Array<Uint8ClampedArray> = [];
    for (let i: number = 0; i < originalImageData.data.length; i += pixelsPerLine) {
      lines.push(originalImageData.data.slice(i, i + pixelsPerLine));
    }

    const lLine: number = ((): number => {
      for (let i: number = 0; i < lines.length; i++) {
        for (let j: number = 0; j < lines.length; j++) {
          const v = lines[j][i * 4];
          if (v != 255) {
            return i;
          }
        }
      }
      return 0;
    })();

    const rLine: number = ((): number => {
      for (let i: number = lines.length - 1; i >= 0; i--) {
        for (let j: number = 0; j < lines.length; j++) {
          const v = lines[j][i * 4];
          if (v != 255) {
            return i;
          }
        }
      }
      return lines.length - 1;
    })();

    const tLine: number = ((): number => {
      for (let i: number = 0; i < lines.length; i++) {
        const line: Uint8ClampedArray = lines[i]
        for (let j: number = 0; j < line.length; j += 4) {
          const v = line[j];
          if (v != 255) {
            return i;
          }
        }
      }
      return 0;
    })();

    const bLine: number = ((): number => {
      for (let i: number = lines.length - 1; i >= 0; i--) {
        const line: Uint8ClampedArray = lines[i]
        for (let j: number = 0; j < line.length; j += 4) {
          const v = line[j];
          if (v != 255) {
            return i;
          }
        }
      }
      return lines.length - 1;
    })();

    const canvasMidpoint = lines.length / 2;
    const horizontalShift = canvasMidpoint - Math.floor((rLine - lLine) / 2 + lLine);
    const verticalShift = canvasMidpoint - Math.floor((bLine - tLine) / 2 + tLine);

    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(originalImageData, horizontalShift, verticalShift);

    return originalImageData;
  }

  public gridify(): void {
    // save original canvas data then center it for better data.
    const originalImageData = this.center();

    // generate grid from centered data.
    const cells: Array<Array<number>> = [];
    for (let row: number = 0; row < this.gridRows; row++) {
      const rowData: Array<number> = [];
      for (let column: number = 0; column < this.gridColumns; column++) {
        const cellImageData: ImageData = this.ctx.getImageData(column * this.tileWidth, row * this.tileHeight, this.tileWidth, this.tileHeight);
        const avgGrey: number = this.getAverageGreyscale(cellImageData);
        rowData.push(avgGrey);
      }
      cells.push(rowData);
    }
    this.grid = new Grid(cells);
    this.gridSvc.grid.next(this.grid);
    this.gridSvc.onChance.next();

    // restore original canvas data to hide centering from user.
    this.ctx.putImageData(originalImageData, 0, 0);
  }

  public clearGrid(): void {
    this.blank = true;
    this.bad = false;
    this.ctx.fillStyle = "#ffaaaa";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.radius / 2, this.radius / 2, this.canvas.width - 2 * this.radius / 2, this.canvas.height - 2 * this.radius / 2);
    this.gridify();
  }
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}
