import {Component, HostListener, OnInit} from "@angular/core";
import {CreateModel} from "./create-model.model";
import {debounceTime, fromEvent, Subject} from "rxjs";

@Component({
  selector: "jnet-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  public model: CreateModel = {
    neuronMap: [5, 8, 3],
    activationFunction: "sigmoid",
    inputLabelMode: "ordinal",
    inputLabelFunction: "i",
    inputLabels: Array.from(Array(999).keys()).map(v => `${v + 1}`),
    outputLabelMode: "ordinal",
    outputLabelFunction: "i",
    outputLabels: Array.from(Array(999).keys()).map(v => `${v + 1}`),
  };

  public step: number = 0;

  public onChange: Subject<void> = new Subject<void>();

  public visualizerWidth: number = document.body.offsetWidth * 0.9;
  public visualizerHeight: number = 500;

  public constructor() {
  }

  public ngOnInit(): void {
    fromEvent(window, "resize").pipe(debounceTime(100)).subscribe(() => {
      this.recalculateWidth();
      this.onChange.next();
    });

    setTimeout(() => {
      this.recalculateWidth();
      this.onChange.next();
    });
  }

  public recalculateWidth(): void {
    this.visualizerWidth = document.body.offsetWidth * 0.9;
  }

  public activationFunctionChanged(activationFunction: string): void {
    this.model.activationFunction = activationFunction;
  }

  public next(): void {
    if (this.step >= 4) {
      return;
    }

    this.step++;
  }

  public previous(): void {
    if (this.step <= 0) {
      return;
    }

    this.step--;
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.altKey) {
      switch (event.key) {
        case "ArrowRight":
          this.next();
          break;
        case "ArrowLeft":
          this.previous();
          break;
      }
    }
  }
}
