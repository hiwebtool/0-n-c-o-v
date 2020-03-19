var config = {
    apiKey: "AIzaSyD8O1ePlGUfc5tjKADiqcGgRKlIKhuYlhI",
    authDomain: "flowing-coil-206511.firebaseapp.com",
    databaseURL: "https://flowing-coil-206511.firebaseio.com",
    projectId: "flowing-coil-206511",
    storageBucket: "flowing-coil-206511.appspot.com",
    messagingSenderId: "987814011059",
    appId: "1:987814011059:web:4de509f64dfc72f0fc10c6",
    measurementId: "G-EVEHXJTTN0"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

navigator.serviceWorker.register('firebase-messaging-sw.js')
.then(function (registration) {
    messaging.useServiceWorker(registration);
        
    // Request for permission
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      messaging.getToken()
      .then(function(currentToken) {
        if (currentToken) {
          console.log('Token: ' + currentToken)
          sendTokenToServer(currentToken);
        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
          setTokenSentToServer(false);
        }
      })
      .catch(function(err) {
        console.log('An error occurred while retrieving token. ', err);
        setTokenSentToServer(false);
      });
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
});

// Handle incoming messages
messaging.onMessage(function(payload) {
  console.log("Notification received: ", payload);
  toastr["info"](payload.notification.body, payload.notification.title);
});

// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent 
    // to the app server.
    setTokenSentToServer(false);
    // Send Instance ID token to app server.
    sendTokenToServer(refreshedToken);
  })
  .catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
  });
});

// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
var token;
var iffirst=true;
var pharmlist=[];
function sendTokenToServer(currentToken) {
  token=currentToken;
  if(iffirst){
    iffirst=false;
    var xhr=new XMLHttpRequest();
      xhr.open('GET','https://us-central1-mask00ncovkorea.cloudfunctions.net/app/info?Token='+token);
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            json2=JSON.parse(xhr.responseText);
            if(json2.success && json2.data.rel!=undefined){
              for(var a in json2.data.rel.topics){
                pharmlist.push(a);
              }
            }
          }
        }
      }
      xhr.send();
  }
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
        'unless it changes');
  }
}

function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') == 1;
}

function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}