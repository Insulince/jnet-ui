import {Component, Input, OnInit, Output} from "@angular/core";
import {CreateModel} from "../create-model.model";
import {BehaviorSubject, Subject} from "rxjs";
import {ApiService} from "../../../services/api.service";
import {CreateNetworkRequest, CreateNetworkResponse} from "../../../models/api.model";
import {StorageService} from "../../../services/storage.service";
import {HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: "jnet-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"]
})
export class ReviewComponent implements OnInit {
  @Input() model!: CreateModel;

  @Output() changed: Subject<void> = new Subject<void>();
  @Output() creating: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loading: boolean = false;

  public constructor(private api: ApiService,
                     private storageSvc: StorageService,
                     private router: Router) {
  }

  public ngOnInit(): void {
    this.changed.next();
  }

  public create(): void {
    this.loading = true;
    this.creating.next(true);
    const req: CreateNetworkRequest = {
      neuronMap: this.model.neuronMap,
      activationFunction: this.model.activationFunction,
      inputLabels: this.model.inputLabels,
      outputLabels: this.model.outputLabels
    };
    this.api.createNetwork(req).subscribe(
      (res: HttpResponse<CreateNetworkResponse>): void => {
        this.loading = false;
        this.creating.next(false);
        this.storageSvc.clearActiveNetworkId();
        const networkId: string = res.headers.get("Location")!;
        if (networkId === null) {
          throw new Error("no Location header in response")
        }
        this.storageSvc.setActiveNetworkId(networkId);
        this.router.navigate(["/view", this.storageSvc.getActiveNetworkId()]).then();
      },
      (error: Error): void => {
        console.error(error);
        this.loading = false;
        this.creating.next(false);
      }
    );
  }
}
