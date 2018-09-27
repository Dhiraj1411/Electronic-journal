import { TestBed, inject } from '@angular/core/testing';

import { SidebarSubmitBtnClickService } from './sidebar-submit-btn-click.service';

describe('SidebarSubmitBtnClickService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarSubmitBtnClickService]
    });
  });

  it('should be created', inject([SidebarSubmitBtnClickService], (service: SidebarSubmitBtnClickService) => {
    expect(service).toBeTruthy();
  }));
});
