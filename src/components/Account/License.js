import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices } from '../../lib/Api';
import format from 'date-fns/format';
import Layout from '../../containers/PageLayout';
import Head from '../../components/Head';
import Error from '../../components/GenericErrorPage';
import Loading from '../Loading';

export default class License extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoices: null,
      loading: true,
      error: null,
    };
  }

  async componentDidMount() {
    let error = null;
    let invoices = null;
    try {
      invoices = await getInvoices(this.props.user);
    } catch (e) {
      console.log(e);
      error = {
        status: e.status,
        message: `Unable to load invoices: ${e.message}`,
      };
    }

    if (invoices.status) {
      error = invoices;
      invoices = null;
    }

    this.setState({
      invoices,
      error,
      loading: false,
    });

    console.log('did mount', invoices);
  }

  render() {
    const { invoices, loading, error } = this.state;

    if (loading) {
      return <Loading isLoading={true} />;
    }

    if (error) {
      return <Error status={error.status} message={error.message} />;
    }

    return (
      <Layout className="License">
        <Head title="Licence" />
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
                    Invoice for £{i.total.toFixed(0)} for the period {' '}
                    {format(i.start, 'D MMMM, YYYY')} -{' '}
                    {format(i.end, 'D MMMM, YYYY')}
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
      </Layout>
    );
  }
}
