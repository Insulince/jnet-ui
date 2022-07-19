import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NeuronMapComponent } from "./neuron-map.component";

describe("NeuronMapComponent", () => {
  let component: NeuronMapComponent;
  let fixture: ComponentFixture<NeuronMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NeuronMapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NeuronMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
