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
  iframe.setAttribute(
    'allow',
<<<<<<< HEAD
    'geolocation microphone camera midi encrypted-media'
  );
=======
    'geolocation; midi; camera; microphone; speaker;' );
>>>>>>> fbfb488110c289b32ea91ee4ed2be632836ec65a
  return iframe;
}
