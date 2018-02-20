export const allow = 'geolocation; midi; camera; microphone; speaker;';

export default function makeIframe(
  name = 'JS Bin Output',
  className = 'Result'
) {
  const iframe = document.createElement('iframe');
  iframe.hidden = true;
  iframe.name = name;
  iframe.className = className;
  iframe.setAttribute(
    'sandbox',
    'allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts'
  );
  iframe.setAttribute('allow', allow);
  return iframe;
}
