import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import alt from 'altInit';
import Iso from 'iso';
import RootComponent from 'components/RootComponent';

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

app.get('/', (req, res) => {
  const data = {
    LabelStore: {
      label: 'Hello World',
    },
  };

  alt.bootstrap(JSON.stringify(data));
  const markup = renderToString(<RootComponent />);
  const iso = new Iso();
  iso.add(markup, alt.flush());
  const body = iso.render(markup, alt.flush());
  res.send(wrap(body));
});

app.listen(3000);
