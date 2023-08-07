import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable, Subject, map, of } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private mockDataNumber = 30;
  private selectedElement: Subject<Product | Customer | null> = new Subject();
  private data$: Observable<(Product | Customer)[]> = of([]);

  constructor() {}

  getData(): Observable<(Product | Customer)[]> {
    const data = [];

    for (let i = 0; i < this.mockDataNumber; i++) {
      data.push(
        Math.random() > 0.5
          ? this.createRandomProduct(i)
          : this.createRandomCustomer(i)
      );
    }

    this.data$ = of(data);

    return this.data$;
  }

  setSelectedElement(element: Product | Customer | null) {
    this.selectedElement.next(element);
  }

  getSelectedElement(): Observable<Product | Customer | null> {
    return this.selectedElement.asObservable();
  }

  filterData(inputSearched: string): Observable<(Product | Customer)[]> {
    return this.data$.pipe(
      map((data) => {
        return data.filter((element) => {
          const nameFilter = new RegExp(inputSearched, 'i').test(element.name);

          let priceFilter = false;
          if ('price' in element) {
            priceFilter = new RegExp(inputSearched, 'i').test(
              element.price.toString()
            );
          }

          let premiumFilter = false;
          if ('premium' in element) {
            premiumFilter = element.premium;
          }

          return nameFilter || priceFilter || premiumFilter;
        });
      })
    );
  }

  private createRandomProduct(index: number): Product {
    return {
      name: `Product-${index}`,
      productNumber: `${index}`,
      price: Math.random() * 30,
      premium: Math.random() > 0.5,
    };
  }

  private createRandomCustomer(index: number): Customer {
    return {
      name: `Customer-${index}`,
      birthDate: new Date(Math.floor(Math.random() * Date.now())),
    };
  }
}
