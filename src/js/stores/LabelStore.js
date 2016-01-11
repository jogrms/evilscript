import immutable from 'immutable';
import alt from 'altInit';
import actions from 'actions/LabelActions';

class LabelStore {
  constructor() {
    this.bindAction(actions.updateLabel, v => this.swap(s => s.set('label', v)));
    this.data = immutable.fromJS({});
  }

  swap(fn) {
    const next = fn(this.data);
    if (!this.data.equals(next)) {
      this.setState(next);
    }
  }
}

LabelStore.config = {
  onDeserialize(data) {
    return { data: immutable.fromJS(data) };
  },
  onSerialize(state) {
    return state.data.toJS();
  },
  getState(state) {
    return state;
  },
  setState(current, next) {
    this.data = next;
    return { data: next };
  },
};

export default alt.createStore(LabelStore, 'LabelStore');
