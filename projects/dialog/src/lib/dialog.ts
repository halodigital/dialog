import { Observable } from 'rxjs';


export enum HaloDialogOutput {
    Confirmed = 'confirmed',
    Cancelled = 'cancelled',
    CustomAction = 'customAction'
}

export type HaloDialogConfirmOutput = boolean | Observable<boolean | void>;
