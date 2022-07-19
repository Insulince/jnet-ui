import {Component, Input, OnInit, Output} from "@angular/core";
import {CreateModel} from "../create-model.model";
import {Subject} from "rxjs";
import {ApiService} from "../../../services/api.service";
import {CreateNetworkRequest} from "../../../models/api.model";

@Component({
  selector: "jnet-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"]
})
export class ReviewComponent implements OnInit {
  @Input() model!: CreateModel;

  @Output() changed: Subject<void> = new Subject<void>();

  public constructor(private api: ApiService) {
  }

  public ngOnInit(): void {
    this.changed.next();
  }

  public create(): void {
    const req: CreateNetworkRequest = {
      neuronMap: this.model.neuronMap,
      activationFunction: this.model.activationFunction,
      inputLabels: this.model.inputLabels,
      outputLabels: this.model.outputLabels
    };
    this.api.createNetwork(req).subscribe();
  }
}
