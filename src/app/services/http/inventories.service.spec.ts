import { TestBed } from '@angular/core/testing';

import { InventoriesService } from './inventories.service';

describe('InventoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoriesService = TestBed.get(InventoriesService);
    expect(service).toBeTruthy();
  });
});
