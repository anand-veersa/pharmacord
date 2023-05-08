import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redirect-docusign',
  templateUrl: './redirect-docusign.component.html',
  styleUrls: ['./redirect-docusign.component.scss'],
})
export class RedirectDocusignComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['event'] === 'signing_complete') {
        window.parent.postMessage('closeIframe', '/');
      }
    });
  }
}
