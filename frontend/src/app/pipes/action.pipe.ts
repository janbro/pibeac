import { Pipe, PipeTransform } from '@angular/core';
/*
 * Status pipe
*/
@Pipe({name: 'action'})
export class ActionPipe implements PipeTransform {

    static actions = ['URL', 'Flashlight', 'Check-In'];

    transform(value: number, printable: boolean): string {
        if (printable) {
            return ActionPipe.actions[value];
        } else {
            switch (value) {
                case 0:
                    return 'fas fa-link';
                case 1:
                    return 'fas fa-lightbulb';
                case 2:
                    return 'fas fa-user-check';
            }
        }
    }
}
