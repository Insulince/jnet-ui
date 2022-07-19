import {Component, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {CreateModel} from "../create-model.model";
import {Subject} from "rxjs";

@Component({
  selector: "jnet-neuron-map",
  templateUrl: "./neuron-map.component.html",
  styleUrls: ["./neuron-map.component.scss"]
})
export class NeuronMapComponent implements OnInit, OnDestroy {
  @Input() model!: CreateModel;

  @Output() changed: Subject<void> = new Subject<void>();

  // NOTE(justin): This stupid thing was added to address the issue with having numbers be the direct references in the
  // templates. The problem is that when the user updates an input by adding/removing a layer or even just changing a
  // layer's size, the number changes which updates the reference and messes up the template. This is supposed to fix
  // that by mapping model.neuronMap into an array of objects which contain the numbers during ngOnInit, and then
  // mapping it back when done during ngOnDestroy. In this way, updating a number does NOT update a reference and the
  // template should be fine.
  public nm: Array<{ layerSize: number }> = [];

  public constructor() {
  }

  public ngOnInit(): void {
    this.mapFrom();
    this.changedNext();
  }

  public ngOnDestroy(): void {
    this.mapBack();
    this.changedNext();
  }

  public mapFrom(): void {
    this.nm = this.model.neuronMap.map(
      (layerSize: number): { layerSize: number } => {
        return {layerSize: layerSize}
      }
    );
  }

  public mapBack(): void {
    this.model.neuronMap = this.nm.map((o: { layerSize: number }): number => o.layerSize);
  }

  public changedNext(): void {
    this.mapBack();
    this.changed.next();
  }

  public addLayer(): void {
    this.nm.splice(this.nm.length - 1, 0, {layerSize: 1});
    this.changedNext();
  }

  public removeLayer(i: number): void {
    this.nm.splice(i, 1);
    this.changedNext();
  }

  public neuronMapChanged(e: any, li: number): void {
    let v: number = Number(e.target.value);
    if (v < 1) {
      v = 1;
    } else if (v > 999) {
      v = 999;
    }
    this.nm[li].layerSize = v;
    this.changedNext();
  }
}
