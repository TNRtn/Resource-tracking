import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeperiodlistComponent } from './timeperiodlist.component';

describe('TimeperiodlistComponent', () => {
  let component: TimeperiodlistComponent;
  let fixture: ComponentFixture<TimeperiodlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeperiodlistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeperiodlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
