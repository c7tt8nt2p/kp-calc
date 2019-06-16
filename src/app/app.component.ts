import {Component, OnInit} from '@angular/core';
import {Product} from './model/product';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {KeyValue} from '@angular/common';

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

    possibleGroupMap: Map<number, Product[]> = new Map<number, Product[]>();
    impossibleGroupMap: Map<number, Product[]> = new Map<number, Product[]>();

    keyDescOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
        return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
    };

    constructor(private titleService: Title) {
    }


    ngOnInit(): void {
        this.titleService.setTitle(this.title);
        this.productForm = new FormGroup({
            initialDiscount: new FormControl(+0, [Validators.required, Validators.pattern('\\d{1,2}(?!\\d)|100')]),
            promotionPrice: new FormControl(+0, [Validators.required, Validators.pattern('^[0-9]*$')]),
            promotionDiscount: new FormControl(+0, [Validators.required, Validators.pattern('^[0-9]*$')])
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
        this.initialDiscount.patchValue(+this.initialDiscount.value);
        this.promotionPrice.patchValue(+this.promotionPrice.value);
        this.promotionDiscount.patchValue(+this.promotionDiscount.value);

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
        this.totalPriceInitialDiscountDiff = this.takeInitialDiscount(this.totalPrice)
    }

    calculate(): void {
        this.validate();
        this.possibleGroupMap.clear();
        this.impossibleGroupMap.clear();
        if (this.valid) {
            this.doGrouping();
        }
    }

    doGrouping(): void {
        let groupPriceMap: Map<number, Product[]> = new Map<number, Product[]>();

        let combinationList: Product[] = this.getCombinations(this.productList);
        for (let i = 0; i < combinationList.length; i++) {
            let aCombination: Product[] = JSON.parse(JSON.stringify(combinationList[i]));
            if (aCombination.length == 0) {
                continue;
            }
            let totalPrice = aCombination.map(p => p.price).reduce((sum, current) => sum + current, 0);
            groupPriceMap.set(totalPrice, aCombination);
        }
        let sorted = AppComponent.sortGroupPriceMap(groupPriceMap);
        this.displayResults(sorted);
    }

    displayResults(sortedGroupPriceMap: Map<number, Product[]>): void {
        sortedGroupPriceMap.forEach((productList, totalPrice) => {
            let priceWithInitialDiscount = this.takeInitialDiscount(totalPrice);
            console.log(priceWithInitialDiscount + ' :: ' + this.promotionPrice.value + ' --> ' + (totalPrice >= this.promotionPrice.value));
            if (priceWithInitialDiscount >= this.promotionPrice.value) {
                this.possibleGroupMap.set(totalPrice, productList);
            } else {
                this.impossibleGroupMap.set(totalPrice, productList);
            }
        });
    }

    static sortGroupPriceMap(toBeSorted: Map<number, Product[]>): Map<number, Product[]> {
        let sortedMap: Map<number, Product[]>;

        sortedMap = new Map(
            Array
                .from(toBeSorted)
                .sort((a, b) => {
                    return b[0] - a[0];
                })
        );

        return sortedMap;
    }

    getCombinations(array): Product[] {
        function fork(i, t) {
            if (i === array.length) {
                result.push(t);
                return;
            }
            fork(i + 1, t.concat([array[i]]));
            fork(i + 1, t);
        }

        let result: Product[] = [];
        fork(0, []);
        return result;
    }

    productListToText(productList: Product[]): string {
        return productList.map(p => p.name).join(', ');
    }

    takeInitialDiscount(originalPrice: number): number {
        return originalPrice - (originalPrice * this.initialDiscount.value / 100);
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
