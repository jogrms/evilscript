import React from 'react';
import { Router } from 'react-router';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createHistory } from 'history';
import alt from 'altInit';
import Iso from 'iso';
import routes from 'routes';

// Needed for onTouchTap.
// Can go away when react 1.0 release.
injectTapEventPlugin();

window.onload = () => {
  Iso.bootstrap((state, node) => {
    alt.bootstrap(state);
    render(<Router routes={ routes } history={ createHistory() } />, node);
  });
};
