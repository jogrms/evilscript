import express from 'express';
import React from 'react';
import routes from 'routes';
import { renderToString } from 'react-dom/server';
import * as router from 'react-router';
import * as history from 'history';
import alt from 'altInit';
import Iso from 'iso';

const app = express();

app.use(express.static('public'));
app.use(express.static('out/public'));

// TODO: replace with server-side templating.
function wrap(content) {
  return (
    '<html><head>' +
      '<link href="/css/style.css" rel="stylesheet" type="text/css">' +
      '<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"' +
        'rel="stylesheet" type="text/css">' +
    '</head><body>' +
      content +
      '<script type="text/javascript" src="/js/app.js"></script>' +
    '</body></html>'
  );
}

app.use((req, res) => {
  const location = history.createLocation(req.path);

  router.match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search, '/');
    } else if (renderProps) {
      const data = {
        LabelStore: {
          label: 'Hello World',
        },
      };

      alt.bootstrap(JSON.stringify(data));
      const markup = renderToString(<router.RoutingContext { ...renderProps } />);
      const iso = new Iso();
      iso.add(markup, alt.flush());
      const body = iso.render(markup, alt.flush());
      res.send(wrap(body));
    } else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(3000);
