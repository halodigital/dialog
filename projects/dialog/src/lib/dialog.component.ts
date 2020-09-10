import { AfterViewInit, Component, ComponentRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { HaloDialogConfirmOutput, HaloDialogOutput } from './dialog';
import { HaloDialogContentComponent } from './dialog.content.component';


@Component({
    selector: 'halo-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})

export class HaloDialogComponent implements OnInit, AfterViewInit, OnDestroy {

    // come from service
    dialogId: number;
    innerComponent: ComponentRef<HaloDialogContentComponent>;
    title: string;
    subtitle: string;
    confirmCaption = 'Save';
    cancelCaption = 'Cancel';
    customActionCaption: string;
    cssClass: string;
    onConfirm: () => HaloDialogConfirmOutput;
    onCancel: () => void;
    onCustomAction: () => void;
    closeMethod: () => void;
    ////////////////////

    hasError: boolean;
    afterClosed: Subject<HaloDialogOutput>;

    private subRouter: Subscription;
    private subConfirm: Subscription;

    @ViewChild('confirmButton', {static: true}) confirmButton: HTMLButtonElement;

    @HostListener('window:keyup.esc') escPressed(): void {

        this.cancel();

    }

    @HostListener('window:keyup.enter') enterPressed(): void {

        this.confirm();

    }

    get isLoading(): boolean {

        return !!this.innerComponent?.instance.isLoading;

    }

    constructor(private router: Router) {

        this.afterClosed = new Subject<HaloDialogOutput>();

    }

    ngOnInit(): void {

        this.subRouter = this.router.events.subscribe(event => {

            if (event instanceof NavigationEnd) {
                this.cancel();
            }

        });

    }

    ngAfterViewInit(): void {

        setTimeout(() => {

            const focusableElement = this.innerComponent?.instance?.hostElement?.nativeElement.querySelector('input', 'select', 'textarea', 'button');

            if (focusableElement) {

                focusableElement.focus();

            } else {

                this.confirmButton?.focus();

            }

        }, 400);

    }

    ngOnDestroy(): void {

        this.subRouter.unsubscribe();

    }

    confirm(): void {

        if (!this.onConfirm) {

            this.confirmSucceed();

        } else {

            const confirmResult = this.onConfirm();

            if (typeof confirmResult === 'boolean') {

                if (confirmResult) {
                    this.confirmSucceed();
                } else {
                    this.confirmFailed();
                }

            } else { // confirmResult is observable

                this.subConfirm = confirmResult.subscribe(
                    (isSucceed) => {

                        if (isSucceed === false) {
                            this.confirmFailed();
                        } else {
                            this.confirmSucceed();
                        }

                    },
                    () => {

                        this.confirmFailed();

                    }
                );

            }

        }

    }

    cancel(): void {

        if (this.onCancel) {
            this.onCancel();
        }

        this.close(HaloDialogOutput.Cancelled);

    }

    customAction(): void {

        if (this.onCustomAction) {
            this.onCustomAction();
        }

        this.close(HaloDialogOutput.CustomAction);

    }

    private confirmSucceed(): void {

        this.close(HaloDialogOutput.Confirmed);

    }

    private confirmFailed(): void {

        this.hasError = false;

        setTimeout(() => { this.hasError = true; }, 100);

    }

    private close(state: HaloDialogOutput): void {

        if (this.subConfirm) {
            this.subConfirm.unsubscribe();
        }

        this.afterClosed.next(state);
        this.afterClosed.unsubscribe();

        if (this.innerComponent) {
            this.innerComponent.destroy();
        }

        this.closeMethod();

    }

}
