import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { StorageService } from "../services/storage.service";

@Injectable({
  providedIn: "root"
})
export class ActiveNetworkGuard implements CanActivate {
  constructor(private storageSvc: StorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const activeNetworkId: string = this.storageSvc.getActiveNetworkId();
    return activeNetworkId !== "" && activeNetworkId == route.params["networkId"];
  }
}
