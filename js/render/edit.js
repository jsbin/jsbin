// shows this is run through jsbin & you can edit
(function () {
  if (window.location.hash == '#noedit') return;
  var ie = !/*@cc_on!@*/0;
  
  function set(el, props) {
    for (prop in props) {
      el.style[prop] = props[prop];
    }
  }
  
  function hide() {
    if (ie) {
      set(el, { display: 'none' });
    } else {
      emile(el, 'opacity: 0', { duration: 500 });
    }  
  }

  // slightly modded http://github.com/madrobby/emile/
  var emile = (function(f,a){var h=document.createElement("div"),g=("opacity").split(" ");function e(j,k,l){return(j+(k-j)*l).toFixed(3)}function i(k,j,l){return k.substr(j,l||1)}function c(l,p,s){var n=2,m,q,o,t=[],k=[];while(m=3,q=arguments[n-1],n--){if(i(q,0)=="r"){q=q.match(/\d+/g);while(m--){t.push(~~q[m])}}else{if(q.length==4){q="#"+i(q,1)+i(q,1)+i(q,2)+i(q,2)+i(q,3)+i(q,3)}while(m--){t.push(parseInt(i(q,1+m*2,2),16))}}}while(m--){o=~~(t[m+3]+(t[m]-t[m+3])*s);k.push(o<0?0:o>255?255:o)}return"rgb("+k.join(",")+")"}function b(l){var k=parseFloat(l),j=l.replace(/^[\-\d\.]+/,"");return isNaN(k)?{v:j,f:c,u:""}:{v:k,f:e,u:j}}function d(m){var l,n={},k=g.length,j;h.innerHTML='<div style="'+m+'"></div>';l=h.childNodes[0].style;while(k--){if(j=l[g[k]]){n[g[k]]=b(j)}}return n}return function(p,m,j){p=typeof p=="string"?document.getElementById(p):p;j=j||{};var r=d(m),q=p.currentStyle?p.currentStyle:getComputedStyle(p,null),l,s={},n=+new Date,k=j.duration||200,u=n+k,o,t=j.easing||function(v){return(-Math.cos(v*Math.PI)/2)+0.5};for(l in r){s[l]=b(q[l])}o=setInterval(function(){var v=+new Date,w=v>u?1:(v-n)/k;for(l in r){p.style[l]=r[l].f(s[l].v,r[l].v,t(w))+r[l].u}if(v>u){clearInterval(o);j.after&&j.after()}},10)}})();
  
  var event = (function(){return document.addEventListener?function(a,b,c){a.addEventListener(b,c,false)}:function(a,b,c){a.attachEvent("on"+b,function(){return c.call(a,window.event)})}})();

  var el = document.createElement('a');
  set(el, { position: 'fixed', top: 0, right: 0, padding: '5px', background: '#eee', color: '#212121', WebkitBorderBottomLeftRadius: '10px', MozBorderRadiusBottomleft: '10px', border: '1px solid #999', borderRight: 0, borderTop: 0, textDecoration: 'none', font: '14px Helvetica, Arial' });
  el.innerHTML = 'Edit using JS Bin';
  el.href = window.location.pathname + (window.location.pathname.substr(-1) == '/' ? '' : '/') + 'edit';
  
  document.body.appendChild(el);
  setTimeout(hide, 1000);
  var moveTimer = null;
  event(document, 'mousemove', function () {
    if (!ie && el.style.opacity == 0) { // TODO IE compat
      el.style.opacity = 1;
    } else if (ie) {
      set(el, { display: 'block' });
    }
    clearTimeout(moveTimer);
    moveTimer = setTimeout(hide, 2000);
  });
})();