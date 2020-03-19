self.addEventListener('push', function (event) {
    var pushInfo = JSON.parse(event.data.text());
    const options = { // 푸쉬 알림창에 대한 각종 설정
        body: pushInfo.data.content,
        icon: './img/mask.png',
        data: {
            url: pushInfo.data.url
        }
    };

    event.waitUntil(self.registration.showNotification(pushInfo.data.title, options));
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();
	event.waitUntil( clients.openWindow( event.notification.data.url ) );
});