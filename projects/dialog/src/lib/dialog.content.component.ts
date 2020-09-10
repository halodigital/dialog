import { Component, ElementRef, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HaloDialogConfirmOutput } from './dialog';


@Component({
    template: ''
})

export abstract class HaloDialogContentComponent {

    // if the dialog opened with 'waitForContent = true' then contentLoaded() called after the content loaded //

    dialogId: number;
    title: string;
    subtitle: string;
    confirmCaption: string;
    cancelCaption: string;
    customActionCaption: string;
    hostElement: ElementRef;

    form: FormGroup;
    formSubmitted: boolean;
    isLoading: boolean;

    constructor(@Inject(String) title: string = null,
                @Inject(String) subtitle: string = null,
                @Inject(String) confirmCaption: string = null,
                @Inject(String) cancelCaption: string = null,
                @Inject(String) customActionCaption: string = null,
                @Inject(ElementRef) hostElement: ElementRef = null) {

        this.title = title;
        this.subtitle = subtitle;
        this.confirmCaption = confirmCaption;
        this.cancelCaption = cancelCaption;
        this.customActionCaption = customActionCaption;
        this.hostElement = hostElement;

    }

    abstract onConfirm(): HaloDialogConfirmOutput;
    abstract onCancel(): void;
    abstract onCustomAction(): void;

}
