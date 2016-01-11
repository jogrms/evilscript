import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import RootComponent from 'components/RootComponent';
import alt from 'altInit';
import Iso from 'iso';

// Needed for onTouchTap.
// Can go away when react 1.0 release.
injectTapEventPlugin();

window.onload = () => {
  Iso.bootstrap((state, node) => {
    alt.bootstrap(state);
    render(<RootComponent />, node);
  });
};
