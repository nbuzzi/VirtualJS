document.addEventListener('DOMContentLoaded', () => {

    let homeView = new Template();
    homeView.load('/Home/Counter').then(() => {

        //Model
        let controller = {
            pepe: 'Hello world!',
            counter: 0,
            list: [{ name: 'Test', age: 15 }, { name: 'Otro', age: 18 }, { name: 'More', age: 23 }],
            users: [{ id: 1, name: 'xxtestxx' }, { id: 2, name: 'xxpeepexx' }]
        };

        //Set up this document
        let vdom = new VDom(homeView, controller);

        vdom.setActionCallback('.my-button', 'click', (event, data) => {
            data.counter++;
        });

        vdom.addToRouter('/page1');

    });
});