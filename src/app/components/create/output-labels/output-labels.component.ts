import {Component, Input, OnInit, Output} from "@angular/core";
import {CreateModel} from "../create-model.model";
import {Subject} from "rxjs";

@Component({
  selector: "jnet-output-labels",
  templateUrl: "./output-labels.component.html",
  styleUrls: ["./output-labels.component.scss"]
})
export class OutputLabelsComponent implements OnInit {
  @Input() model!: CreateModel;

  @Output() changed: Subject<void> = new Subject<void>();

  public constructor() {
  }

  public ngOnInit(): void {
    this.outputLabelsChanged();
  }

  public range(n: number): Array<number> {
    const arr: Array<number> = [];
    if (n === undefined) {
      return arr;
    }
    for (let i: number = 0; i < n; i++) {
      arr.push(i);
    }
    return arr;
  }

  public outputLabelsChanged(): void {
    if (this.model.outputLabelMode !== "manual") {
      this.model.outputLabels = [];
    }
    switch (this.model.outputLabelMode) {
      case "ordinal":
        for (let i: number = 0; i < this.model.neuronMap[this.model.neuronMap.length - 1]; i++) {
          this.model.outputLabels.push(`${i + 1}`)
        }
        break;
      case "index":
        for (let i: number = 0; i < this.model.neuronMap[this.model.neuronMap.length - 1]; i++) {
          this.model.outputLabels.push(`${i}`)
        }
        break;
      case "alphabetical":
        for (let i: number = 0; i < this.model.neuronMap[this.model.neuronMap.length - 1]; i++) {
          this.model.outputLabels.push(String.fromCharCode(i + 97));
        }
        break;
      case "manual":
        // nothing to do, leave set as-is for manual editing.
        break;
      case "function":
        this.runFunction();
        break;
      default:
        throw new Error(`unrecognized output label mode ${this.model.outputLabelMode}`);
    }
    this.changed.next();
  }

  public manualOutputLabelChanged(): void {
    this.changed.next();
  }

  public outputLabelFunctionChanged(): void {
    this.runFunction();
    this.changed.next();
  }

  public runFunction(): void {
    this.model.outputLabels = [];
    try {
      for (let i: number = 0; i < this.model.neuronMap[this.model.neuronMap.length - 1]; i++) {
        // TODO(justin): Security risk.
        this.model.outputLabels.push(`${eval(this.model.outputLabelFunction)}`)
      }
    } catch (_) {
      for (let i: number = 0; i < this.model.neuronMap[this.model.neuronMap.length - 1]; i++) {
        this.model.outputLabels.push(`invalid function`)
      }
    }
  }
}
