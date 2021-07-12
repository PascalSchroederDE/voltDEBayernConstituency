import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>Hellso {{name}}!</h1>`
})
export class HelloComponent  {
  @Input() name: string;
}
