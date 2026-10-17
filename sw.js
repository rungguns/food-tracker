self.addEventListener("push", event => {
    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        data = {
            body: event.data
                ? event.data.text()
                : "It is time for your medicine."
        };
    }

    const title = data.title || "💊 My Health Reminder";

    const options = {
        body: data.body || "It is time for your medicine.",
        tag: data.tag || "my-health-medicine",
        data: {
            url: data.url || "./"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    const url =
        event.notification.data &&
        event.notification.data.url
            ? event.notification.data.url
            : "./";

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(clientList => {

            for (const client of clientList) {
                if ("focus" in client) {
                    return client.focus();
                }
            }

            return clients.openWindow(url);
        })
    );
});
