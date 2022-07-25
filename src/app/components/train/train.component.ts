import {Component, OnInit} from "@angular/core";
import {Network} from "../../models/network.model";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {GetNetworkResponse, StreamTrainingProgressResponse, TrainNetworkRequest, TrainNetworkResponse} from "../../models/api.model";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "jnet-train",
  templateUrl: "./train.component.html",
  styleUrls: ["./train.component.scss"]
})
export class TrainComponent implements OnInit {
  public readonly maxLines: number = 20;

  public networkId!: string;
  public network!: Network;
  public loading: boolean = false;

  public lines: Array<string> = [];

  public learningRate: number = 0.1;
  public miniBatchSize: number = 10;
  public averageLossCutoff: number = 0.01;
  public minLossCutoff: number = 0.0001;
  public maxIterations: number = 10000;
  // TODO(justin): Implement?
  // public timeout: number;

  public constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.fetchNetwork();

    this.resetLines();

    this.api.streamTrainingProgress(null, this.networkId).subscribe(
      (res: StreamTrainingProgressResponse): void => {
        this.lines[this.lines.length - 1] += " " + res;
        if (isNaN(Number(res))) {
          this.lines.shift();
          this.lines.push("");
          return;
        }
      }
    );
  }

  public fetchNetwork(): void {
    this.loading = true;
    this.networkId = this.route.snapshot.params["networkId"];
    this.api.getNetwork(null, this.networkId).subscribe(
      (res: HttpResponse<GetNetworkResponse>): void => {
        this.network = res.body!;
        this.loading = false;
      },
      (error: Error): void => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  public train(): void {
    this.resetLines();
    const req: TrainNetworkRequest = {
      averageLossCutoff: this.averageLossCutoff,
      learningRate: this.learningRate,
      minLossCutoff: this.minLossCutoff,
      maxIterations: this.maxIterations,
      miniBatchSize: this.miniBatchSize
    }
    this.api.trainNetwork(req, this.networkId).subscribe(
      (_: HttpResponse<TrainNetworkResponse>): void => {
      }
    );
  }

  public resetLines(): void {
    this.lines = [];
    for (let i: number = 0; i < this.maxLines; i++) {
      this.lines.push("")
    }
  }
}
