import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature2Component } from './feature2.component';
import { NgrxUniversalRehydrateModule } from '@trellisorg/ngrx-universal-rehydrate';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [Feature2Component],
    imports: [
        NgrxUniversalRehydrateModule.forFeature(['feature2']),
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: Feature2Component,
            },
        ]),
    ],
    exports: [Feature2Component],
})
export class Feature2Module {}
