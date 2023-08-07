import {
  Component,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerComponent } from '../customer/customer.component';
import { PremiumProductComponent } from '../premium-product/premium-product.component';
import { ProductComponent } from '../product/product.component';
import { DynamicComponentsMapperUtils } from '../../utils/dynamic-components-mapper.utils';
import { Customer } from '../../models/customer';
import { Product } from '../../models/product';
import { MockDataService } from 'src/app/services/mock-data.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  currentComponent: ComponentRef<
    CustomerComponent | PremiumProductComponent | ProductComponent
  > | null = null;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.mockDataService.getSelectedElement().subscribe((element) => {
        this.addDetailsComponentToView(element);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addDetailsComponentToView(element: Customer | Product | null): void {
    if (this.currentComponent != null) {
      this.currentComponent.destroy();
    }
    if (element == null) {
      this.currentComponent = null;
      return;
    }
    const component = DynamicComponentsMapperUtils.getComponent(element);
    this.currentComponent = this.viewContainerRef.createComponent(component);
    this.currentComponent.instance.element = element;
    this.viewContainerRef.insert(this.currentComponent.hostView);
  }
}
