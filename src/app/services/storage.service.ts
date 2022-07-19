import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  public readonly keyActiveNetworkId = "activeNetworkId";

  public readonly activeNetworkIdChange: BehaviorSubject<string> = new BehaviorSubject<string>("");

  public constructor(private api: ApiService) {
  }

  public getActiveNetworkId(): string {
    const activeNetworkId: string | null = localStorage.getItem(this.keyActiveNetworkId);
    if (activeNetworkId === null) {
      return "";
    }
    return activeNetworkId;
  }

  public setActiveNetworkId(activeNetworkId: string): void {
    if (activeNetworkId === "") {
      return;
    }
    const oldActiveNetworkId: string = this.getActiveNetworkId();
    if (oldActiveNetworkId !== "") {
      this.api.deactivateNetwork(null, activeNetworkId).subscribe();
    }
    localStorage.setItem(this.keyActiveNetworkId, activeNetworkId);
    this.activeNetworkIdChange.next(activeNetworkId);
    this.api.activateNetwork(null, activeNetworkId).subscribe();
  }

  public clearActiveNetworkId(): void {
    const oldActiveNetworkId: string = this.getActiveNetworkId();
    if (oldActiveNetworkId === "") {
      return;
    }
    localStorage.setItem(this.keyActiveNetworkId, "");
    this.activeNetworkIdChange.next("");
    this.api.deactivateNetwork(null, oldActiveNetworkId).subscribe();
  }
}
