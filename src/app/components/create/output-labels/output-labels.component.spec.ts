import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OutputLabelsComponent } from "./output-labels.component";

describe("OutputLabelsComponent", () => {
  let component: OutputLabelsComponent;
  let fixture: ComponentFixture<OutputLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutputLabelsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OutputLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
