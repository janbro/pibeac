import { Pipe, PipeTransform } from '@angular/core';
/**
 * Action pipe
 */
@Pipe({name: 'action'})
export class ActionPipe implements PipeTransform {

    /**
     * Available actions
     */
    static actions = [{
        name: 'URL',
        id: 0
    },
    {
        name: 'Flashlight',
        id: 1
    },
    {
        name: 'Check-In',
        id: 2
    }];

    /**
     * Transforms the action id
     *
     * @param value The kind value of the action
     * @param option The desired format (icon, color, none)
     */
    transform(value: number, option: string): string {
        switch (option) {
            case 'icon':
                switch (value) {
                    case 0:
                        return 'fas fa-link';
                    case 1:
                        return 'far fa-lightbulb';
                    case 2:
                        return 'fas fa-user-check';
                    default:
                        return;
                }
            case 'color':
                switch (value) {
                    case 0:
                        return 'border-primary text-primary';
                    case 1:
                        return 'border-warning text-warning';
                    case 2:
                        return 'border-success text-success';
                    default:
                        return;
                }
            default:
                return ActionPipe.actions[value].name;
        }
    }
}
