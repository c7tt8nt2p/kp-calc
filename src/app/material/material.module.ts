import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule
    ],
    exports: [
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule
    ]
})
export class MaterialModule {
}
