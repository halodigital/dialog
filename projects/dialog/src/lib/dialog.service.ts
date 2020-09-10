import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector, Type } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HaloDialogOutput } from './dialog';
import { HaloDialogComponent } from './dialog.component';
import { HaloDialogContentComponent } from './dialog.content.component';


@Injectable({
    providedIn: 'root'
})

export class HaloDialogService {

    private openedDialogs: ComponentRef<HaloDialogComponent>[] = [];

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private appRef: ApplicationRef,
                private injector: Injector) {}

    open(component: Type<HaloDialogContentComponent>, waitForContent: boolean = false, cssClass?: string): Observable<HaloDialogOutput> {

        const parentFactory = this.componentFactoryResolver.resolveComponentFactory(HaloDialogComponent);
        const parentRef = parentFactory.create(this.injector);
        const parentElement = (parentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

        const contentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const contentRef = contentFactory.create(this.injector);
        const contentElement = (contentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        const contentPlaceholder = parentElement.getElementsByTagName('main')[0];
        const dialogId = Math.random() * 10000;

        this.openedDialogs.push(parentRef);

        parentRef.instance.innerComponent = contentRef;
        parentRef.instance.dialogId = dialogId;
        parentRef.instance.cssClass = cssClass || '';
        parentRef.instance.title = contentRef.instance.title;
        parentRef.instance.subtitle = contentRef.instance.subtitle;
        parentRef.instance.closeMethod = this.close.bind(this, dialogId);

        contentRef.instance.dialogId = dialogId;

        if (contentRef.instance.confirmCaption) {
            parentRef.instance.confirmCaption = contentRef.instance.confirmCaption;
        }

        if (contentRef.instance.cancelCaption) {
            parentRef.instance.cancelCaption = contentRef.instance.cancelCaption;
        }

        if (contentRef.instance.customActionCaption) {
            parentRef.instance.customActionCaption = contentRef.instance.customActionCaption;
        }

        if (contentRef.instance.onConfirm) {
            parentRef.instance.onConfirm = contentRef.instance.onConfirm.bind(contentRef.instance);
        }

        if (contentRef.instance.onCancel) {
            parentRef.instance.onCancel = contentRef.instance.onCancel.bind(contentRef.instance);
        }

        if (contentRef.instance.onCustomAction) {
            parentRef.instance.onCustomAction = contentRef.instance.onCustomAction.bind(contentRef.instance);
        }

        this.appRef.attachView(contentRef.hostView);
        this.appRef.attachView(parentRef.hostView);

        contentPlaceholder.appendChild(contentElement);

        if (!waitForContent) {
            this.contentLoaded(dialogId);
        }

        return parentRef.instance.afterClosed;

    }

    message(message: string, title?: string, subtitle?: string): Observable<boolean> {

        if (this.isMessageDisplayed(message)) {

            return of(false);

        }

        const parentFactory = this.componentFactoryResolver.resolveComponentFactory(HaloDialogComponent);
        const parentRef = parentFactory.create(this.injector);
        const parentElement = (parentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        const contentPlaceholder = parentElement.getElementsByTagName('main')[0];
        const dialogId = Math.random() * 10000;
        const output = new Subject<boolean>();

        this.openedDialogs.push(parentRef);

        parentRef.instance.dialogId = dialogId;
        parentRef.instance.title = title;
        parentRef.instance.subtitle = subtitle;
        parentRef.instance.confirmCaption = 'Yes';
        parentRef.instance.cancelCaption = 'No';
        parentRef.instance.closeMethod = this.close.bind(this, dialogId);

        parentRef.instance.onConfirm = () => {

            setTimeout(() => {

                if (!output.closed) {

                    output.next(true);
                    output.unsubscribe();

                }

            }, 200);

            return true;
        };

        parentRef.instance.onCancel = () => {

            output.next(false);
            output.unsubscribe();

        };

        this.appRef.attachView(parentRef.hostView);

        contentPlaceholder.classList.add('halo-dialog-message');
        contentPlaceholder.textContent = message;

        document.body.appendChild(parentElement);

        return output;

    }

    contentLoaded(dialogId: number): void {

        const dialog = this.openedDialogs.find(d => d.instance.dialogId === dialogId);
        const dialogElement = (dialog?.hostView as EmbeddedViewRef<any>)?.rootNodes[0] as HTMLElement;

        if (dialogElement) {

            document.body.appendChild(dialogElement);

        }

    }

    close(dialogId: number): void {

        const dialogIndex = this.openedDialogs.findIndex(dialog => dialog.instance.dialogId === dialogId);

        if (dialogIndex > -1) {

            this.openedDialogs[dialogIndex].destroy();

            this.openedDialogs.splice(dialogIndex, 1);

        }

    }

    private isMessageDisplayed(message: string): boolean {

        return this.openedDialogs.some(dialog => {

            const dialogElement = (dialog?.hostView as EmbeddedViewRef<any>)?.rootNodes[0] as HTMLElement;
            const dialogMessage = dialogElement?.getElementsByTagName('main')?.[0]?.textContent;

            return dialogMessage === message;

        });

    }

}
