import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedVocabContainerComponent } from './saved-vocab-container.component';

describe('SavedVocabContainerComponent', () => {
  let component: SavedVocabContainerComponent;
  let fixture: ComponentFixture<SavedVocabContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedVocabContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedVocabContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
