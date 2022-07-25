import {Component, OnInit} from "@angular/core";
import {Network} from "../../models/network.model";
import {ApiService} from "../../services/api.service";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {GetNetworkResponse} from "../../models/api.model";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: "jnet-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"]
})
export class NavComponent implements OnInit {
  public activeNetworkId: string = "";
  public network: Network | null = null;
  public loading: boolean = false;

  public constructor(private api: ApiService, private storageSvc: StorageService, private router: Router) {
  }

  public ngOnInit(): void {
    this.fetchNetwork();
    this.storageSvc.activeNetworkIdChange.subscribe(
      (_: string): void => {
        this.fetchNetwork();
      }
    );
  }

  public fetchNetwork(): void {
    this.loading = true;
    this.activeNetworkId = this.storageSvc.getActiveNetworkId();
    if (this.activeNetworkId === "") {
      this.network = null;
      this.loading = false;
      return
    }
    this.api.getNetwork(null, this.activeNetworkId).subscribe(
      (res: HttpResponse<GetNetworkResponse>): void => {
        this.loading = false;
        this.network = res.body;
      },
      (error: Error): void => {
        console.error(error);
        this.storageSvc.clearActiveNetworkId();
      }
    );
  }

  public deactivateNetwork(): void {
    this.storageSvc.clearActiveNetworkId();
    this.activeNetworkId = "";
    this.router.navigate(["/home"]).then();
  }
}
