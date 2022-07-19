import {Component, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {Network} from "../../models/network.model";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {GetNetworkResponse} from "../../models/api.model";

@Component({
  selector: "jnet-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"]
})
export class ViewComponent implements OnInit {
  public networkId!: string;
  public network!: Network;
  public loading: boolean = false;

  public onChange: Subject<void> = new Subject<void>();
  public width: number = 500;
  public height: number = 250;

  public constructor(private api: ApiService, private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
    this.fetchNetwork();
  }

  public fetchNetwork(): void {
    this.loading = true;
    this.networkId = this.route.snapshot.params["networkId"];
    this.api.getNetwork(null, this.networkId).subscribe(
      (response: GetNetworkResponse): void => {
        this.network = response;
        this.loading = false;
      },
      (error: Error): void => {
        console.error(error);
        this.loading = false;
      }
    );
  }
}
