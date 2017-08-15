import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import PageLayout from '../../containers/PageLayout';

export default class License extends Component {
  render() {
    const invoices = [
      { id: 1, date: '2014-06-23' },
      { id: 2, date: '2015-06-23' },
      { id: 3, date: '2016-06-23' },
      { id: 4, date: '2017-06-23' },
    ];
    return (
      <PageLayout className="License">
        <h1>Your JS Bin License</h1>
        <p>Level: pro</p>
        <p>Started: 19 December, 2014</p>
        <p>Next payment: 23 July, 2018</p>

        <h2>Invoices</h2>
        <ul>
          {invoices
            .map(i => {
              return (
                <li key={i.id}>
                  <Link to={`/account/invoice/${i.id}`}>
                    Invoice for {format(i.date, 'D MMMM, YYYY')} - 23 July, 2018
                  </Link>
                </li>
              );
            })
            .reverse()}
        </ul>

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
      </PageLayout>
    );
  }
}
