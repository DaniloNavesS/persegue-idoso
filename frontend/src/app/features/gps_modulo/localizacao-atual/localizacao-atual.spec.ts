import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizacaoAtualComponent } from './localizacao-atual';

describe('LocalizacaoAtualComponent', () => {
  let component: LocalizacaoAtualComponent;
  let fixture: ComponentFixture<LocalizacaoAtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizacaoAtualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocalizacaoAtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
