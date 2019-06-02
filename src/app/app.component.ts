import {Component, OnInit} from '@angular/core';
import {Product} from "./model/product";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: 'app.html',
    styles: []
})
export class AppComponent implements OnInit {
    title = 'kp-calc';

    productForm: FormGroup;
    productList: Product[] = [];

    ngOnInit(): void {
        this.productForm = new FormGroup({
            name: new FormControl('', [Validators.required]),
            price: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
        });
    }

    onProductAdded(): void {
        console.log('s');
        this.productList.push(new Product());
    }


    get name() {
        return this.productForm.get('name');
    }

    get price() {
        return this.productForm.get('price');
    }
}
