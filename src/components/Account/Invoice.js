import React, { Component } from 'react';
import format from 'date-fns/format';
import PageLayout from '../../containers/PageLayout';
import Loading from '../Loading';
import '../../css/Invoice.css';

const percent = s => s;

const dp2 = s => s.toFixed(2);

export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      invoice: null,
    };
  }

  componentDidMount() {
    const invoice = {
      receipt_number: '#2039-1660',
      date: '2017-08-15',
      lines: {
        data: [
          {
            plan: { name: 'Pro yearly', interval: 'year' },

            amount: 6000,
          },
        ],
      },
    };
    this.setState({
      invoice,
      loading: false,
    });

    console.log('did mount', invoice);
  }

  render() {
    const { invoice, loading = true } = this.state;

    if (loading) {
      return <Loading isLoading={true} />;
    }

    return (
      <PageLayout className="Invoice">
        <h1>
          Invoice <small>{invoice.receipt_number}</small>
        </h1>

        <h2>
          {format(invoice.date, 'MMMM D, YYYY')}
        </h2>

        <table>
          <tbody>
            <tr>
              <td>Charges</td>
              <td className="right">Amount</td>
            </tr>
            {invoice.lines.data.map((line, i) => {
              return (
                <tr key={`line-${i}`}>
                  <td>
                    <strong>
                      Subscription to {line.plan.name} (£{dp2(line.amount / 100)}/{line.plan.interval})
                    </strong>
                  </td>

                  <td className="right">
                    £ {dp2(line.amount / 100)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table className="detail">
          <tbody>
            <tr>
              <td>Subtotal:</td>
              <td>
                £ {dp2(invoice.subtotal / 100)}
              </td>
            </tr>

            {invoice.discount &&
              <tr>
                <td>Discount:</td>
                <td>
                  £{' '}
                  {percent(
                    invoice.subtotal,
                    invoice.discount.coupon.percent_off,
                    2
                  )}}
                </td>
              </tr>}

            <tr>
              <td>Total:</td>
              <td>
                £ {dp2(invoice.total / 100)}
              </td>
            </tr>
            <tr>
              <td>Amount paid:</td>
              <td>
                £ {invoice.paid ? dp2(invoice.total / 100) : '0.00'}
              </td>
            </tr>
          </tbody>
        </table>

        <footer>
          <p>Charges on your credit card bill will be from "JSBIN PRO".</p>
          <p>
            <small>
              JS Bin Ltd. Company No. 8998555, VAT No. GB189688326. Office 1, 44
              Burstead Close, Brighton BN1 7HT
            </small>
          </p>
        </footer>
      </PageLayout>
    );
  }
}
