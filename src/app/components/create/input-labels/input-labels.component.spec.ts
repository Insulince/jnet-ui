import { ComponentFixture, TestBed } from "@angular/core/testing";

import { InputLabelsComponent } from "./input-labels.component";

describe("InputLabelsComponent", () => {
  let component: InputLabelsComponent;
  let fixture: ComponentFixture<InputLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputLabelsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
