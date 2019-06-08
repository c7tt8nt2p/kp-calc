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
    valid: boolean = true;

    constructor() {
    }


    ngOnInit(): void {
        this.productForm = new FormGroup({
            initialDiscount: new FormControl('', [Validators.required, Validators.pattern('\\d{1,2}(?!\\d)|100')])
            // name: new FormControl('', [Validators.required]),
            // price: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
        });
    }

    addProduct(): void {
        let newProduct: Product = new Product();
        newProduct.name = '';
        newProduct.price = 0;
        this.productList.push(newProduct);
    }

    onNameChanged(index: number, value: string): void {
        this.productList[index].name = value;
    }

    onPriceChanged(index: number, value: number): void {
        this.productList[index].price = value;
    }

    validate(): void {
        for (let aProduct of this.productList) {
            let name = aProduct.name;
            if (!name) {
                this.valid = false;
                return;
            }
            let price = aProduct.price.toString();
            let isNumber = new RegExp(/^-?(0|[1-9]\d*)?$/).test(price);
            if (!price || !isNumber) {
                this.valid = false;
                return;
            }
        }
        this.valid = true;
    }

    calculate(): void {
        this.validate();

        if (this.valid) {

        }
    }

    get initialDiscount() {
        return this.productForm.get('initialDiscount');
    }


}
