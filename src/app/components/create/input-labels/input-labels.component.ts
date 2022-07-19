import {Component, Input, OnInit, Output} from "@angular/core";
import {CreateModel} from "../create-model.model";
import {Subject} from "rxjs";

@Component({
  selector: "jnet-input-labels",
  templateUrl: "./input-labels.component.html",
  styleUrls: ["./input-labels.component.scss"]
})
export class InputLabelsComponent implements OnInit {
  @Input() model!: CreateModel;

  @Output() changed: Subject<void> = new Subject<void>();

  public constructor() {
  }

  public ngOnInit(): void {
    this.inputLabelsChanged();
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

  public inputLabelsChanged(): void {
    if (this.model.inputLabelMode !== "manual") {
      this.model.inputLabels = [];
    }
    switch (this.model.inputLabelMode) {
      case "ordinal":
        for (let i: number = 0; i < this.model.neuronMap[0]; i++) {
          this.model.inputLabels.push(`${i + 1}`)
        }
        break;
      case "index":
        for (let i: number = 0; i < this.model.neuronMap[0]; i++) {
          this.model.inputLabels.push(`${i}`)
        }
        break;
      case "alphabetical":
        for (let i: number = 0; i < this.model.neuronMap[0]; i++) {
          this.model.inputLabels.push(String.fromCharCode(i + 97));
        }
        break;
      case "manual":
        // nothing to do, leave set as-is for manual editing.
        break;
      case "function":
        this.runFunction();
        break;
      default:
        throw new Error(`unrecognized input label mode ${this.model.inputLabelMode}`);
    }
    this.changed.next();
  }

  public manualInputLabelChanged(): void {
    this.changed.next();
  }

  public inputLabelFunctionChanged(): void {
    this.runFunction();
    this.changed.next();
  }

  public runFunction(): void {
    this.model.inputLabels = [];
    try {
      for (let i: number = 0; i < this.model.neuronMap[0]; i++) {
        // TODO(justin): Security risk.
        this.model.inputLabels.push(`${eval(this.model.inputLabelFunction)}`)
      }
    } catch (_) {
      for (let i: number = 0; i < this.model.neuronMap[0]; i++) {
        this.model.inputLabels.push(`invalid function`)
      }
    }
  }
}
