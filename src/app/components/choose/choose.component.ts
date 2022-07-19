import {Component, OnInit} from "@angular/core";
import {Network} from "../../models/network.model";
import {Observable, Subject, switchMap, tap} from "rxjs";
import {ApiService} from "../../services/api.service";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
import {DeleteNetworkResponse, SearchNetworksResponse} from "../../models/api.model";

@Component({
  selector: "jnet-choose",
  templateUrl: "./choose.component.html",
  styleUrls: ["./choose.component.scss"]
})
export class ChooseComponent implements OnInit {
  public loading: boolean = false;

  public networks: Array<Network> = [];

  public onChange: Subject<void> = new Subject<void>();
  public width: number = 500;
  public height: number = 250;

  public constructor(private api: ApiService, private storageSvc: StorageService, private router: Router) {
  }

  public ngOnInit(): void {
    this.loading = true;
    this.api.searchNetworks(null, true).subscribe(
      (res: SearchNetworksResponse) => {
        this.loading = false;
        this.networks = res.networks;
      },
      (error: Error): void => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  public activateNetwork(networkId: string | undefined): void {
    if (networkId === undefined) {
      throw new Error("no network id")
    }
    this.storageSvc.setActiveNetworkId(networkId);
  }

  public isActiveNetwork(networkId: string | undefined): boolean {
    const activeNetworkId: string = this.storageSvc.getActiveNetworkId();
    if (activeNetworkId === "") {
      return false;
    }
    return networkId === activeNetworkId;
  }

  public deleteNetwork(networkId: string | undefined): void {
    if (networkId === undefined) {
      throw new Error("no network id provided");
    }

    this.api.deleteNetwork(null, networkId).pipe(
      tap((_: DeleteNetworkResponse): void => this.storageSvc.clearActiveNetworkId()),
      switchMap((_: DeleteNetworkResponse): Observable<SearchNetworksResponse> => {
        return this.api.searchNetworks(null);
      })
    ).subscribe(
      (res: SearchNetworksResponse): void => {
        this.networks = res.networks;
      }
    );
  }

  public viewNetwork(): void {
    this.router.navigate(["/view", this.storageSvc.getActiveNetworkId()]).then();
  }
}
