import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { CreateComponent } from "./components/create/create.component";
import { ChooseComponent } from "./components/choose/choose.component";
import { ViewComponent } from "./components/view/view.component";
import { ActiveNetworkGuard } from "./guards/active-network.guard";
import { DataComponent } from "./components/data/data.component";
import { TrainComponent } from "./components/train/train.component";
import { TestComponent } from "./components/test/test.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "create",
    component: CreateComponent
  },
  {
    path: "choose",
    component: ChooseComponent
  },
  {
    path: "view/:networkId",
    component: ViewComponent,
    canActivate: [ActiveNetworkGuard]
  },
  {
    path: "data/:networkId",
    component: DataComponent,
    canActivate: [ActiveNetworkGuard]
  },
  {
    path: "train/:networkId",
    component: TrainComponent,
    canActivate: [ActiveNetworkGuard]
  },
  {
    path: "test/:networkId",
    component: TestComponent,
    canActivate: [ActiveNetworkGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
