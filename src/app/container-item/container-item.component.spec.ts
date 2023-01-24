import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerItemComponent } from './container-item.component';

describe('ContainerItemComponent', () => {
  let component: ContainerItemComponent;
  let fixture: ComponentFixture<ContainerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
