import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HaloLoadingModule } from '@halodigital/loading-animation';
import { HaloDialogComponent } from './dialog.component';


@NgModule({
    declarations: [
        HaloDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HaloLoadingModule
    ],
    exports: [
        HaloDialogComponent
    ]
})

export class HaloDialogModule {}
