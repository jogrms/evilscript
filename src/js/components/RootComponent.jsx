import React from 'react';
import { Grid, Input } from 'react-bootstrap';
import store from 'stores/LabelStore';
import actions from 'actions/LabelActions';

export default React.createClass({
  getInitialState() {
    return store.getState().data;
  },

  componentDidMount() {
    store.listen(this._onStoreUpdate);
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.equals(this.state);
  },

  componentWillUnmount() {
    store.unlisten(this._onStoreUpdate);
  },

  _onStoreUpdate(state) {
    // Call replaceState instead of setState to avoid state merging.
    this.replaceState(state.data);
  },

  render() {
    return (
      <Grid>
        <Input
          type="text"
          value={ this.state.get('label') }
          label={ this.state.get('label') }
          onChange={ (e) => actions.updateLabel(e.target.value) }
        />
      </Grid>
    );
  },
});
