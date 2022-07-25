import {Component, HostListener, OnInit} from "@angular/core";
import {Network} from "../../models/network.model";
import {TrainingDatum} from "../../models/training-datum.model";
import {Subject} from "rxjs";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {GridService} from "../../services/grid.service";
import {AddTrainingDataRequest, AddTrainingDataResponse, GetNetworkResponse} from "../../models/api.model";
import {Grid} from "../../models/grid.model";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "jnet-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.scss"]
})
export class DataComponent implements OnInit {
  public networkId!: string;
  public network!: Network;
  public loading: boolean = false;

  public readonly canvasDimension: number = 256;
  public readonly canvasWidth: number = this.canvasDimension;
  public readonly canvasHeight: number = this.canvasDimension;

  public readonly gridDimension = 24;
  public readonly gridRows: number = this.gridDimension;
  public readonly gridColumns: number = this.gridDimension;

  public readonly penSize: number = 10;

  public trainingData: Array<TrainingDatum> = [];
  public nums: any = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  public num: number = 0;

  public readonly onReset: Subject<void> = new Subject<void>();

  public constructor(private api: ApiService, private route: ActivatedRoute, private gridSvc: GridService) {
  }

  public ngOnInit(): void {
    this.fetchNetwork();

    this.nextNum();
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

  public nextNum(): void {
    this.num = ~~(Math.random() * 10)
  }

  public stage(): void {
    const grid: Grid = this.gridSvc.grid.getValue();

    const truth: Array<number> = [];
    for (let i: number = 0; i < 10; i++) {
      truth.push(-1);
    }
    truth[this.num] = 1;
    this.trainingData.push({id: "", networkId: "", data: grid.flatten(), truth: truth});
    this.nums[this.num]++;
    this.nextNum();
    this.reset();
  }

  public reset(): void {
    this.onReset.next();
  }

  public submit(): void {
    const req: AddTrainingDataRequest = {
      trainingData: this.trainingData
    }
    this.api.addTrainingData(req, this.networkId).subscribe(
      (_: HttpResponse<AddTrainingDataResponse>): void => {
        this.reset();
        this.clear();
      }
    );
  }

  public clear(): void {
    this.trainingData = [];
    for (let i: number = 0; i < 10; i++) {
      this.nums[i] = 0;
    }
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case " ":
        this.stage();
        break;
      case "c":
        this.reset();
        break;
    }
  }
}
