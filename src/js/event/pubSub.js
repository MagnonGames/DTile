class PubSub {
	constructor() {
		this.subscribers = [];
	}

	subscribe(eventName, handler) {
		this.subscribers.push(new Subscriber(eventName, handler));
	}

	publish(eventName, params) {
		for (let i = this.subscribers.length - 1; i >= 0; i--) {
			let subscriber = this.subscribers[i];

			if (subscriber.eventName == eventName) {
				subscriber.call(params);
			}
		}
	}
}

class Subscriber {
	constructor(eventName, handler) {
		this.eventName = eventName;
		this.handler = handler;
	}

	call(params) {
		this.handler(params);
	}
}

export default (new PubSub());
