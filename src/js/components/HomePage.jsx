import React from 'react';
import { Link } from 'react-router';

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Link to="/login">login</Link>
      </div>
    );
  }
}
