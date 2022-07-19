import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Model} from "../../models/model.model";
import {debounceTime, fromEvent, Subject} from "rxjs";

@Component({
  selector: "jnet-visualizer",
  templateUrl: "./visualizer.component.html",
  styleUrls: ["./visualizer.component.scss"]
})
export class VisualizerComponent implements OnInit {
  @Input() model!: Model;
  @Input() redraw!: Subject<void>;
  @Input() showLabels!: boolean;

  @Input() width!: number;
  @Input() height!: number;
  @Input() radius!: number;

  // Layer Limit is the number of layers to display including the output and input layer.
  // If for example you have a layer limit of 4, you would see IL -> L2 -> L3 -> ... -> OL
  @Input() layerLimit!: number;
  // Neuron Limit is the number of neurons to display including the last neuron.
  // If for example you have a neuron limit of 4, you would see N1 -> N2 -> N3 -> ... -> NN
  @Input() neuronLimit!: number;

  @ViewChild("visualizer") private readonly visualizer!: ElementRef<HTMLCanvasElement>;

  public get canvas(): HTMLCanvasElement {
    return this.visualizer.nativeElement;
  }

  public get ctx(): CanvasRenderingContext2D {
    const ctx: CanvasRenderingContext2D | null = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("ctx is null")
    }
    return ctx;
  }

  public constructor() {
  }

  public ngOnInit(): void {
    setTimeout((): void => this.draw());
    this.redraw.subscribe((): void => this.draw());
    fromEvent(window, "resize").pipe(
      debounceTime(100)
    ).subscribe((): void => this.redraw.next());
  }

  public draw(): void {
    if (!this.visualizer) {
      return;
    }

    const ctx: CanvasRenderingContext2D = this.ctx;
    let nm: Array<number> = this.model.neuronMap;
    const af: string = this.model.activationFunction;
    const ils: Array<string> = this.model.inputLabels;
    const ols: Array<string> = this.model.outputLabels;
    const r: number = this.radius;
    const w: number = this.width;
    const h: number = this.height;

    const ei: EtcInfo = this.getEtcInfo(nm);

    // TODO(justin) Check Etc limits are correct/valid.

    nm = this.processEtcLimits(nm, ei);

    // clear the entire canvas
    this.ctx.clearRect(0, 0, w, h);

    this.drawConnections(ctx, ei, nm, r, w, h);

    this.drawNeurons(ctx, ei, nm, af, ils, ols, r, w, h);
  }

  public processEtcLimits(nm: Array<number>, ei: EtcInfo): Array<number> {
    const lnm: Array<number> = [];

    for (let li: number = 0; li < nm.length; li++) {
      if (li < ei.etcStartIndex) {
        lnm.push(nm[li]);
      } else if (li == ei.etcStartIndex) {
        lnm.push(-1);
      } else if (li > ei.etcStartIndex && li <= ei.etcEndIndex) {
        continue;
      } else {
        lnm.push(nm[li]);
      }
    }

    return lnm;
  }

  public drawConnections(ctx: CanvasRenderingContext2D, ei: EtcInfo, nm: Array<number>, r: number, w: number, h: number): void {
    for (let li: number = 1; li < nm.length; li++) {
      let neuronsInLayer = nm[li];
      let neuronsInPreviousLayer = nm[li - 1];
      if (neuronsInLayer === -1) {
        // current layer is etc.
        neuronsInLayer = 1;
      } else if (neuronsInPreviousLayer === -1) {
        // previous layer is etc.
        neuronsInPreviousLayer = 1;
      }
      for (let ni: number = 0; ni < neuronsInLayer; ni++) {
        if (ni > this.neuronLimit) {
          continue;
        }
        for (let pni: number = 0; pni < neuronsInPreviousLayer; pni++) {
          if (pni > this.neuronLimit) {
            continue;
          }
          const x1: number = this.X(li - 1, nm, w);
          const y1: number = this.Y(pni, nm[li - 1], h);
          const x2: number = this.X(li, nm, w);
          const y2: number = this.Y(ni, nm[li], h);
          this.drawConnection(ctx, r, x1, y1, x2, y2)
        }
      }
    }
  }

  public drawConnection(ctx: CanvasRenderingContext2D, r: number, x1: number, y1: number, x2: number, y2: number): void {
    ctx.strokeStyle = "black";
    ctx.lineWidth = r / 5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  public drawNeurons(ctx: CanvasRenderingContext2D, ei: EtcInfo, nm: Array<number>, af: string, ils: Array<string>, ols: Array<string>, r: number, w: number, h: number): void {
    for (let li: number = 0; li < nm.length; li++) {
      let layerSize: number = nm[li];
      let isEtcLayer: boolean = false;
      if (layerSize === -1) {
        layerSize = 1;
        isEtcLayer = true;
      }

      let x: number;
      let y: number;
      for (let ni: number = 0; ni < layerSize; ni++) {
        if (ni > this.neuronLimit) {
          continue;
        }

        x = this.X(li, nm, w);
        y = this.Y(ni, layerSize, h);

        // draw white filled circle to hide excess lines
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = "white";
        ctx.fill();

        if (isEtcLayer || (ni === this.neuronLimit - 1 && layerSize !== this.neuronLimit)) {
          // draw ellipsis in circle
          this.drawEllipsis(ctx, x, y, r);
        } else {
          // draw activation functions
          this.drawActivationFunction(ctx, af, x, y, r)
        }

        // draw black outlined circle to show neurons and trim edges of activation functions
        ctx.lineWidth = r / 5;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();

        if (this.showLabels) {
          // draw input labels
          if (li === 0) {
            let il: string = ils[ni];
            if (ni === this.neuronLimit - 1 && nm[0] > this.neuronLimit) {
              il = "";
            } else if (ni === this.neuronLimit) {
              il = ils[nm[0] - 1];
            }
            if (il === undefined) {
              il = "<unset>";
            }
            this.drawInputLabel(ctx, il, x, y, r);
          }

          // draw output labels
          if (li === nm.length - 1) {
            let ol: string = ols[ni];
            if (ni === this.neuronLimit - 1 && nm[nm.length - 1] > this.neuronLimit) {
              ol = "";
            } else if (ni === this.neuronLimit) {
              ol = ols[nm[nm.length - 1] - 1];
            }
            if (ol === undefined) {
              ol = "<unset>";
            }
            this.drawOutputLabels(ctx, ol, x, y, r);
          }
        }
      }
    }
  }

  public drawActivationFunction(ctx: CanvasRenderingContext2D, af: string, x: number, y: number, r: number): void {
    r *= 0.8
    x -= r;
    y -= r;

    ctx.strokeStyle = "red";
    ctx.lineWidth = r / 10;

    ctx.beginPath();
    switch (af) {
      case "sigmoid":
        this.drawSigmoid(ctx, x, y, r);
        break;
      case "relu":
        this.drawRelu(ctx, x, y, r);
        break;
      case "tanh":
        this.drawTanh(ctx, x, y, r);
        break;
      case "linear":
        this.drawLinear(ctx, x, y, r);
        break;
      case "noop":
        this.drawNoop(ctx, x, y, r);
        break;
      default:
        throw new Error(`unrecognized activation function "${af}"`)
    }
    ctx.stroke();
  }

  public drawSigmoid(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    for (let i: number = 0; i < 2 * r; i++) {
      const v: number = this.sigmoid((i - r) / (2 * r / 10));
      ctx.lineTo(x + i, y - (v * 2 * r * 0.9) + 2 * r * 0.95);
    }
  }

  public drawRelu(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.moveTo(x, y + r);
    ctx.lineTo(x + r, y + r);
    ctx.lineTo(x + 2 * r, y);
  }

  public drawTanh(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    for (let i: number = 0; i < 2 * r; i++) {
      const v: number = Math.tanh((i - r) / (2 * r / 10));
      ctx.lineTo(x + i, y - (v * r * 0.9) + r);
    }
  }

  public drawLinear(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.moveTo(x, y + 2 * r);
    ctx.lineTo(x + 2 * r, y);
  }

  public drawNoop(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.moveTo(x, y + r);
    ctx.lineTo(x + 2 * r, y + r);
  }

  public drawEllipsis(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    const ellipsis: string = "..."
    const fontSize: number = 1.5 * r;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";
    const tm = ctx.measureText(ellipsis);
    ctx.fillText(ellipsis, x - tm.width / 2, y + 0.1 * r);
  }

  public drawInputLabel(ctx: CanvasRenderingContext2D, il: string, x: number, y: number, r: number): void {
    x -= r;

    const fontSize: number = 14;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";
    const tm = ctx.measureText(il);
    ctx.fillText(il, x - tm.width - 8, y + fontSize / 2);
  }

  public drawOutputLabels(ctx: CanvasRenderingContext2D, ol: string, x: number, y: number, r: number): void {
    x += r;

    const fontSize: number = 14;
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";
    ctx.fillText(ol, x + 8, y + fontSize / 2);
  }

  public getEtcInfo(nm: Array<number>): EtcInfo {
    const ei: EtcInfo = {
      etcStartIndex: this.layerLimit - 1,
      etcEndIndex: nm.length - 1 - 1,
      lastUninterruptedSlot: this.layerLimit - 1,
      displaySlot: this.layerLimit,
      lastLayerSlot: this.layerLimit + 1
    };

    // If this network is as long as the layer limit...
    if (nm.length === this.layerLimit) {
      // Push the start offset beyond the end of the layer limit to avoid triggering it. It should not be triggered.
      ei.etcStartIndex = this.layerLimit + 1;
    }

    return ei;
  }

  public getNetcInfos(nm: Array<number>): Array<NetcInfo> {
    const nis: Array<NetcInfo> = [];

    for (let li: number = 0; li < nm.length; li++) {
      const l: number = nm[li];

      const ni: NetcInfo = {
        etcStartIndex: this.neuronLimit - 1,
        etcEndIndex: l - 1 - 1,
        lastUninterruptedSlot: this.neuronLimit - 1,
        displaySlot: this.neuronLimit,
        lastLayerSlot: this.neuronLimit + 1
      };

      // If this layer is as long as the neuron limit...
      if (l === this.neuronLimit) {
        // Push the start offset beyond the end of the neuron limit to avoid triggering it. It should not be triggered.
        ni.etcStartIndex = this.neuronLimit + 1;
      }

      nis.push(ni);
    }

    return nis;
  }

  // TODO(justin): What in god's name is this function.
  public X(li: number, nm: Array<number>, w: number): number {
    const neuronMapSize: number = nm.length;
    const x = (li * 2 + 1) / (neuronMapSize * 2 + 1) * w + ((w / (neuronMapSize * 2 + 1)) / 2);
    if (this.showLabels) {
      return x;
    } else {
      return x + ((((li * 2 + 2) - (neuronMapSize * 2 + 2) / 2) * w / 25) / (0.75 * neuronMapSize));
    }
  }

  // TODO(justin): This one as well, omg.
  public Y(ni: number, layerSize: number, h: number): number {
    if (layerSize === -1) {
      layerSize = 1;
    } else if (layerSize > this.neuronLimit) {
      layerSize = this.neuronLimit + 1;
    }
    const y: number = (ni * 2 + 1) / (layerSize * 2 + 1) * h + ((h / (layerSize * 2 + 1)) / 2);
    return y;
  }

  public sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
}

// NOTE(justin) indices are different from slots in that slots start from 1 and indices start from 0. Indices should be
// used in conjunction with an array, and slots should be more for mental modeling of what's going on.

interface EtcInfo {
  etcStartIndex: number; // The index of the first layer to be etc.
  etcEndIndex: number; // The index of the last layer to be etc.

  lastUninterruptedSlot: number; // The last slot to display before the etc display.
  displaySlot: number; // The slot where the etc display will show.
  lastLayerSlot: number; // The slot where the last layer will be displayed.
}

interface NetcInfo {
  etcStartIndex: number; // The index of the first layer to be etc.
  etcEndIndex: number; // The index of the last layer to be etc.

  lastUninterruptedSlot: number; // The last slot to display before the etc display.
  displaySlot: number; // The slot where the etc display will show.
  lastLayerSlot: number; // The slot where the last layer will be displayed.
}
