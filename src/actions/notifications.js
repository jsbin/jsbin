export const ADD_NOTIFICATION = '@@notifications/ADD';
export const DISMISS_NOTIFICATION = '@@notifications/DISMISS';
export const DISMISS_ALL_NOTIFICATIONS = '@@notifications/DISMISS_ALL';

// notification types
export const ERROR = 'NOTIFICATION_ERROR';
export const OK = 'NOTIFICATION_OK';
export const CONFIRM = 'NOTIFICATION_CONFIRM';

/**
 * create new notification
 * @param {String} value - text for notification
 * @param {String} notificationType - ERROR, OK, CONFIRM
 */
export function addNotification(value, props = {}, notificationType = OK) {
  return dispatch => {
    const onDismiss = function() {
      if (props.onDismiss) {
        props.onDismiss();
      }

      dispatch(dismissNotification(this.key));
    };

    dispatch({
      type: ADD_NOTIFICATION,
      value,
      notificationType,
      props: { ...props, onDismiss },
    });
  };
}

export function dismissAllNotifications() {
  return { type: DISMISS_ALL_NOTIFICATIONS };
}

/**
 * @param {Number} id - id of notification to dismiss
 */
export function dismissNotification(value) {
  return { type: DISMISS_NOTIFICATION, value };
}
