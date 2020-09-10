# Dialog by Halo-Digital

This package contains a popup dialog with the following features:

- Custom component dialog with save/cancel buttons

- Message dialog with yes/no buttons

- Ability to add another custom button (to custom component dialog only)

- Ability to close the dialog from outside (for custom component dialog only)

Enjoy!


## Attributes of Custom Component

##### component
<sub>Angular component that extends HaloDialogContentComponent</sub>  
<sub>**Type:** HaloDialogContentComponent</sub>
<br />

##### waitForContent
<sub>If the component contains an observable to fetch some data, and you want to open the dialog only after the was data fetched
Pay attention, if you set it to true, you need to call 'contentLoaded' callback from the service after the data was fetched</sub>  
<sub>**Type:** boolean</sub>  
<sub>**Default:** false</sub>
<br />

##### cssClass
<sub>Declare a custom css class</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />


## Attributes of Message

##### message
<sub>The message text</sub>  
<sub>**Type:** string</sub>  
<br />

##### title
<sub>The dialog title</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />

##### subtitle
<sub>The dialog subtitle</sub>  
<sub>**Type:** string</sub>  
<sub>**Default:** null</sub>
<br />


## Result

##### Custom Component
The dialog implement an observable that returns 'confirmed', 'cancelled' or 'customAction'

##### Message
The dialog implement an observable that returns boolean


## Examples

##### Open Method for Custom Component 

```
this.dialogService.open(CustomComponent);

this.dialogService.open(CustomComponent, true, 'some-css-class');

this.dialogService.open(CustomComponent).subscribe(result => {

    ...

});
```

##### Open Method for Message

```
this.dialogService.message('Some message');

this.dialogService.message('Some message', 'Title', 'Subtitle');

this.dialogService.message('Some message').subscribe(result => {

    ...

});
```

##### Close Method for Custom Component 

```
// dialogId come from HaloDialogContentComponent

this.dialogService.close(dialogId);
```

##### Custom Component Implementation

```
export class SomeComponent extends HaloDialogContentComponent {

    constructor(private dataService: DataService, private dialogService: HaloDialogService, hostElement: ElementRef) {

        super('Title', 'Subtitle', 'Confirm Button Caption', 'Cancel Button Caption', 'Custom Button Caption', hostElement);

        this.dataService.loadData().subscribe(
            () => {

                // You need to call contentLoaded() only if you declared waitForContent = true
                // dialogId come from HaloDialogContentComponent

                this.dialogService.contentLoaded(this.dialogId);

            },
            () => {

                // You need to call contentLoaded() only if you declared waitForContent = true
                // dialogId come from HaloDialogContentComponent

                this.dialogService.contentLoaded(this.dialogId);

            }
        );

    }

    ...

}
```
