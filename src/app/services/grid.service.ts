import { BehaviorSubject, Subject } from "rxjs";
import { Grid } from "../models/grid.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class GridService {
  public grid: BehaviorSubject<Grid> = new BehaviorSubject<Grid>(new Grid([]));

  public onChange: Subject<void> = new Subject<void>();

  public constructor() {
  }
}
