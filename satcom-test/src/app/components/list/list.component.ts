import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, debounce, of, timer } from 'rxjs';
import { Customer } from 'src/app/models/customer';
import { Product } from 'src/app/models/product';
import { MockDataService } from 'src/app/services/mock-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  filterForm: FormControl;
  subscriptions = new Subscription();
  public data$: Observable<(Product | Customer)[]>;
  selectedElement: Product | Customer | null = null;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();

    this.subscriptions.add(
      this.mockDataService.getSelectedElement().subscribe((element) => {
        this.selectedElement = element;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initForm(): void {
    this.filterForm = new FormControl();
    this.subscriptions.add(
      this.filterForm.valueChanges
        .pipe(debounce(() => timer(200)))
        .subscribe((filterValue) => {
          this.onFilterChange(filterValue);
        })
    );
  }

  loadData(): void {
    this.data$ = this.mockDataService.getData();
  }

  onFilterChange(inputSearched: string) {
    this.subscriptions.add(
      this.mockDataService.filterData(inputSearched).subscribe((data) => {
        this.data$ = of(data);
      })
    );
  }

  onClick(element: Product | Customer) {
    this.mockDataService.setSelectedElement(
      this.isSelected(element) ? null : element
    );
  }

  isPremium(element: Product | Customer): boolean {
    return 'premium' in element && element.premium;
  }

  isSelected(element: Product | Customer): boolean {
    return this.selectedElement === element;
  }
}
