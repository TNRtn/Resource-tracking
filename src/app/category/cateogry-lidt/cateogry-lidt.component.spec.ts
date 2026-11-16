import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateogryLidtComponent } from './cateogry-lidt.component';

describe('CateogryLidtComponent', () => {
  let component: CateogryLidtComponent;
  let fixture: ComponentFixture<CateogryLidtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CateogryLidtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CateogryLidtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
