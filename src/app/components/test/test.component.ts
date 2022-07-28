import {Component, HostListener, OnDestroy, OnInit} from "@angular/core";
import {Network} from "../../models/network.model";
import {GetNetworkResponse, TestNetworkRequest, TestNetworkResponse} from "../../models/api.model";
import {catchError, finalize, Observable, of, Subject, switchMap, takeUntil, tap} from "rxjs";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {GridService} from "../../services/grid.service";
import {Grid} from "../../models/grid.model";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "jnet-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"]
})
export class TestComponent implements OnInit, OnDestroy {
  public networkId!: string;
  public network!: Network;
  public loading: boolean = false;

  public readonly canvasDimension: number = 256;
  public readonly canvasWidth: number = this.canvasDimension;
  public readonly canvasHeight: number = this.canvasDimension;

  public readonly gridDimension: number = 24;
  public readonly gridRows: number = this.gridDimension;
  public readonly gridColumns: number = this.gridDimension;

  public readonly penSize: number = 10;

  public result: TestNetworkResponse = {confidence: 0, output: ""};

  public manualTesting: boolean = false;

  public readonly onReset: Subject<void> = new Subject<void>();

  public onDestroy: Subject<void> = new Subject<void>();

  public constructor(private api: ApiService, private route: ActivatedRoute, private gridSvc: GridService) {
  }

  public ngOnInit(): void {
    this.fetchNetwork();

    let inFlight: boolean = false;
    this.gridSvc.onChange.pipe(
      tap(() => {
        if (this.manualTesting) {
          this.result = {confidence: 0, output: "N/A"};
        }
      }),
      switchMap((): Observable<HttpResponse<TestNetworkResponse>> | Observable<null> => {
        if (this.manualTesting || inFlight) {
          if (this.blank()) {
            this.result = {confidence: 0, output: "N/A"};
          }
          return of(null);
        }

        const req: TestNetworkRequest = {
          input: this.gridSvc.grid.getValue().flatten()
        };
        inFlight = true;
        return this.api.testNetwork(req, this.networkId).pipe(
          tap(
            (res: HttpResponse<TestNetworkResponse>): void => {
              this.result = res.body!;
            }
          ),
          finalize(() => inFlight = false)
        );
      }),
      takeUntil(this.onDestroy),
      catchError((error: Error, c) => c),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
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

  public test(): void {
    const grid: Grid = this.gridSvc.grid.getValue();

    const req: TestNetworkRequest = {
      input: grid.flatten()
    };
    this.api.testNetwork(req, this.networkId).subscribe(
      (res: HttpResponse<TestNetworkResponse>): void => {
        this.result = res.body!;
      }
    );
  }

  public reset(): void {
    this.result = {confidence: 0, output: ""}
    this.onReset.next();
  }

  public testingChanged(): void {
    setTimeout(
      () => {
        if (this.manualTesting) {
          this.result = {confidence: 0, output: "N/A"}
        } else {

        }
      }
    );
  }

  public blank(): boolean {
    const grid: Grid = this.gridSvc.grid.getValue();
    return grid.flatten().filter(c => c !== 1).length === 0;
  }


  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case " ":
        this.test();
        break;
      case "c":
        this.reset();
        break;
    }
  }
}
