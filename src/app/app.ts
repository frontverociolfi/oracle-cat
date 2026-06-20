import { Component } from '@angular/core';

import { OraclePage } from './features/oracle/oracle.page';

@Component({
  selector: 'oc-root',
  imports: [OraclePage],
  templateUrl: './app.html',
})
export class App {}
