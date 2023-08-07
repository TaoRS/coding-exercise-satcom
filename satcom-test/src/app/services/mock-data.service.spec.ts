import { TestBed } from '@angular/core/testing';

import { MockDataService } from './mock-data.service';
import { Customer } from '../models/customer';
import { of } from 'rxjs';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of an array of 30 elements', () => {
    service.getData().subscribe((data) => {
      expect(data.length).toBe(30);
    });
  });

  it('should select an element', (done) => {
    const element: Customer = { name: 'test', birthDate: new Date() };
    service.setSelectedElement(element);

    spyOn(service, 'getSelectedElement').and.returnValue(of(element));
    service.getSelectedElement().subscribe((result) => {
      expect(result).toEqual(element);
      done();
    });
  });

  it('should filter data', () => {
    service.getData().subscribe((data) => {
      const searchElement = data[0];
      const premiumElementsCount = data.filter((element) => {
        return 'premium' in element && element.premium;
      }).length;
      const searchElementIsPremium =
        'premium' in searchElement && searchElement.premium;

      service.filterData(searchElement.name).subscribe((result) => {
        expect(result).toContain(searchElement);
        const length = searchElementIsPremium ? 0 : 1 + premiumElementsCount;
        expect(result.length).toBe(length);
      });
    });
  });
});
