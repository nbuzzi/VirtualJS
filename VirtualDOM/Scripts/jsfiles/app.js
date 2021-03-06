﻿document.addEventListener('DOMContentLoaded', () => {

    let homeView = new Template();
    homeView.load('/Home/Counter').then(() => {

        //Model
        let modelController = {
            pepe: 'Hello world!',
            messagePartial: "Hey! i'm a partial view!",
            counter: 0,
            list: [{ name: 'Test', age: 15 }, { name: 'Otro', age: 18 }, { name: 'More', age: 23 }],
            users: [{ id: 1, name: 'xxtestxx' }, { id: 2, name: 'xxpeepexx' }]
        };

        //Set up this document
        let vdom = new VDom(homeView, modelController);

        vdom.setActionCallback('.my-button', 'click', (event, data) => {
            data.counter++;
        });

        vdom.addToRouter('/page1');
    });
});