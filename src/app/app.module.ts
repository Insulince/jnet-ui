import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ActiveNetworkGuard } from "./guards/active-network.guard";
import { HomeComponent } from "./components/home/home.component";
import { ViewComponent } from "./components/view/view.component";
import { CanvasGridComponent } from "./components/canvas-grid/canvas-grid.component";
import { ChooseComponent } from "./components/choose/choose.component";
import { CreateComponent } from "./components/create/create.component";
import { DataComponent } from "./components/data/data.component";
import { NavComponent } from "./components/nav/nav.component";
import { TestComponent } from "./components/test/test.component";
import { TrainComponent } from "./components/train/train.component";
import { VisualizerComponent } from "./components/visualizer/visualizer.component";
import { ActivationFunctionComponent } from "./components/create/activation-function/activation-function.component";
import { InputLabelsComponent } from "./components/create/input-labels/input-labels.component";
import { NeuronMapComponent } from "./components/create/neuron-map/neuron-map.component";
import { OutputLabelsComponent } from "./components/create/output-labels/output-labels.component";
import { ReviewComponent } from "./components/create/review/review.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ViewComponent,
    CanvasGridComponent,
    ChooseComponent,
    CreateComponent,
    DataComponent,
    NavComponent,
    TestComponent,
    TrainComponent,
    VisualizerComponent,
    ActivationFunctionComponent,
    InputLabelsComponent,
    NeuronMapComponent,
    OutputLabelsComponent,
    ReviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatExpansionModule,
    MatChipsModule,
    MatInputModule,
    FormsModule
  ],
  providers: [ActiveNetworkGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
