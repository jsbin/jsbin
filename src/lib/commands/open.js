import React from 'react';
import idk from 'idb-keyval';
import { push } from 'react-router-redux';
import distanceInWords from 'date-fns/distance_in_words';
import { getBins } from '../Api';
import summary from '../summary';

export const open = {
  title: 'Open...',
  run: async (dispatch, { user }) => {
    const keys = await idk.keys();
    if (keys.length === 0) {
      return [
        {
          title: `…you don't have any locally saved bins`,
        },
      ];
    }

    const now = Date.now();

    const remoteBins = getBins(user).then(bins => {
      if (!Array.isArray(bins)) {
        return [];
      }

      return bins.map(bin => {
        let content = bin.summary;
        if (content.length > 100) {
          content = content.substr(0, 99) + '…';
        }

        const display = (
          <span>
            <span
              className="brick"
              style={{
                backgroundColor: `#${bin.id.toString().slice(-6)}`,
              }}
            />
            {content}
            <span className="updated">
              {' '}{distanceInWords(now, bin.date, { addSuffix: true })}
            </span>
          </span>
        );

        return {
          title: bin.title,
          updated: bin.date,
          display,
          run: dispatch => dispatch(push(`/${bin.url}/${bin.revision}`)),
        };
      });
    });

    return Promise.all([
      remoteBins,
      ...keys.map(key => {
        return idk.get(key).then(res => {
          let content = summary(res);

          if (!content) {
            content = key;
          }

          if (content.length > 100) {
            content = content.substr(0, 99) + '…';
          }

          const hex = (res.id || '').split('-').pop();

          const display = (
            <span>
              {hex.length === 3 &&
                <span
                  className="brick"
                  style={{ backgroundColor: `#${hex}` }}
                />}
              {content}
              {res.updated &&
                <span className="updated">
                  {' '}{distanceInWords(now, res.updated, { addSuffix: true })}
                </span>}
            </span>
          );

          return {
            title: content,
            updated: res.updated ? res.updated.toJSON() : null,
            display,
            run: dispatch => dispatch(push('/local/' + key)),
          };
        });
      }),
    ])
      .then(([remote, ...bins]) => {
        return remote.concat(bins).sort((a, b) => {
          if (!a.updated) return 1;
          return a.updated < b.updated ? 1 : -1;
        });
      })
      .catch(e => {
        console.log(e);
      });
  },
};
