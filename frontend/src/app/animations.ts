import { animate, style, transition, trigger } from "@angular/animations";

export const animations = [
    trigger('info', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('0.3s ease-in-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            animate('0.3s ease-in-out', style({ opacity: 0 }))
        ])
    ]),
    trigger('nav', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('0.3s ease-in-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            animate('0.3s ease-in-out', style({ opacity: 0 }))
        ])
    ])
];