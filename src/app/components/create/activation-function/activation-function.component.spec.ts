import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivationFunctionComponent } from "./activation-function.component";

describe("ActivationFunctionComponent", () => {
  let component: ActivationFunctionComponent;
  let fixture: ComponentFixture<ActivationFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivationFunctionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivationFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
