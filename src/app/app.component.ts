import {Component, OnInit} from '@angular/core';
import {Product} from './model/product';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: 'app.html',
    styleUrls: ['app.css']
})
export class AppComponent implements OnInit {
    title = 'KING POWER Calculator';

    productForm: FormGroup;
    productList: Product[] = [];
    valid: boolean = true;

    totalPrice: number = 0;
    totalPriceInitialDiscountDiff: number = 0;


    constructor(private titleService: Title) {
    }


    ngOnInit(): void {
        this.titleService.setTitle(this.title);
        this.productForm = new FormGroup({
            initialDiscount: new FormControl(+0, [Validators.required, Validators.pattern('\\d{1,2}(?!\\d)|100')]),
            promotionPrice: new FormControl(+0, [Validators.required, Validators.pattern('\\d{1,2}(?!\\d)|100')]),
            promotionDiscount: new FormControl(+0, [Validators.required, Validators.pattern('\\d{1,2}(?!\\d)|100')])
        });
    }

    addProduct(): void {
        let newProduct: Product = new Product();
        newProduct.name = '';
        newProduct.price = 0;
        this.productList.push(newProduct);
    }

    removeProduct(index: number): void {
        this.productList.splice(index, 1);
        this.validate();
    }

    onNameChanged(index: number, value: string): void {
        this.productList[index].name = value;
    }

    onNameCleared(index: number): void {
        this.productList[index].name = '';
    }

    onPriceChanged(index: number, value: number): void {
        this.productList[index].price = +value;
    }

    validate(): void {
        for (let aProduct of this.productList) {
            let name = aProduct.name;
            if (!name) {
                this.valid = false;
                return;
            }
            let price = aProduct.price.toString();
            let isNumber = !isNaN(Number(price));
            if (!price || !isNumber) {
                this.valid = false;
                return;
            }
        }
        this.valid = true;
        this.postValidate();
    }

    postValidate(): void {
        if (!this.productForm.valid) {
            return;
        }

        // total price
        if (!this.productList.length) {
            this.totalPrice = 0;
        } else {
            this.totalPrice = this.productList.map(p => p.price).reduce((sum, current) => sum + current, 0);
        }

        // total price and initial discount difference
        let initialDiscount = +this.initialDiscount.value;
        this.totalPriceInitialDiscountDiff = this.totalPrice - (this.totalPrice * initialDiscount / 100);
    }

    calculate(): void {
        this.validate();
        if (this.valid) {
            this.doGrouping();
        }
    }

    doGrouping(): void {
        for (let i = 0; i < this.productList.length; i++) {
            let aProduct = this.productList[i];
        }
    }

    get initialDiscount() {
        return this.productForm.get('initialDiscount');
    }

    get promotionPrice() {
        return this.productForm.get('promotionPrice');
    }

    get promotionDiscount() {
        return this.productForm.get('promotionDiscount');
    }

}
