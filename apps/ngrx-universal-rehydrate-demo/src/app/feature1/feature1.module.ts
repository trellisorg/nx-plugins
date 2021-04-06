import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature1Component } from './feature1.component';
import { NgrxUniversalRehydrateModule } from '@trellisorg/ngrx-universal-rehydrate';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [Feature1Component],
    imports: [
        NgrxUniversalRehydrateModule.forFeature(['feature1']),
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: Feature1Component,
            },
        ]),
    ],
    exports: [Feature1Component],
})
export class Feature1Module {}
