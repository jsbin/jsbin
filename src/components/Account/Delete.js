import React, { Component } from 'react';

export default class AccountDelete extends Component {
  render() {
    return (
      <div className="Delete">
        <h1>Delete your account</h1>
        <p>
          So you're thinking of leaving. Okay, that makes us sad, but JS Bin
          won't stop you - we're all sure you're destined to do great things,
          with JS Bin or not.
        </p>

        <div className="warning-zone">
          <h3>The Cancellation Zone</h3>
          <p>
            This will delete your profile, your settings, your history of bins
            and all the bins you've created (both online on jsbin.com and in
            your local machine). It will leave a permanent hole in the
            interwebs.
          </p>

          <p>
            Proceed with caution, as this process cannot, under any
            circumstances, be reversed.
          </p>

          <button>Delete my entire JS Bin account!</button>
        </div>
      </div>
    );
  }
}
