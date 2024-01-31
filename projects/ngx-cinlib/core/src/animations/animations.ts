import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';

export const defaultAnimationDuration = 400;

export const fadeInAnimation = (duration: number = defaultAnimationDuration) => 
  trigger('fadeIn', [
    transition(':enter', 
    [
      style({ opacity: 0, transform: 'scale(0.5)' }),
      animate(`${duration}ms ease-out`, style({ opacity: 1, transform: 'scale(1)' }))
    ]),
  ]);

export const growOnSidesAnimation = (duration: number = defaultAnimationDuration) => 
  trigger('growOnSides', [
    transition(':enter', 
    [
      style({ opacity: 0, transform: 'scaleX(0)'}),
      animate(`${duration}ms ease-out`, style({ opacity: 1, transform: 'scaleX(1)'}))
    ]),
  ]);

export const collapse = (duration: number = defaultAnimationDuration) =>
  trigger('collapse', [
    state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
    state('false', style({ height: '0', visibility: 'hidden' })),
    transition('false => true', animate(`${duration}ms ease-in`)),
    transition('true => false', animate(`${duration}ms ease-out`))
  ]);

export const fadeInFromRightAnimation = trigger('fadeInFromRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(150px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);