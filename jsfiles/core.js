/****************************************************************************************************************************************/

/*                                                          CORE                                                                        */
/****************************************************************************************************************************************/
const configDefault = { attributes: true, childList: true, characterData: true };

var $$ = (query, dom = document) => {
    return dom.querySelectorAll(query);
};

const createDOM = (stringTemplate = `<!doctype html><html><head></head><body></body></html>`, format = "text/html") => {
    let dom = new DOMParser();

    return dom.parseFromString(stringTemplate, format);
};

const applyDocument = (doc) => {
    if (doc) {
        document.body.innerHTML = doc.body.innerHTML;
    }
};

class VDom {

    constructor(template = ``, format = 'text/html') {
        this._template = template;
        this._format = format;

        this.virtual = createDOM(this._template, this._format);

        this.Callbacks = {

            attribModifiedCallback: (event) => {

            },
            attribNameChangedCallback: (event) => {

            },
            characterDataModifiedCallback: (event) => {

            },
            elementNameChangedCallback: (event) => {

            },
            nodeInsertedIntoDocumentCallback: (event) => {

            },
            nodeInsertedCallback: (event) => {

            },
            nodeRemovedCallback: (event) => {

            },
            removedFromDocumentCallback: (event) => {

            },
            subtreeModifiedCallback: (event) => {

            },
        };

        this.arrayCallbacks = [{ domEvent: 'DOMAttrModified', callback: { DOMAttrModified: this.Callbacks.attribModifiedCallback } },
        { domEvent: 'DOMAttributeNameChanged', callback: { DOMAttributeNameChanged: this.Callbacks.attribNameChangedCallback } },
        { domEvent: 'DOMCharacterDataModified', callback: { DOMCharacterDataModified: this.Callbacks.characterDataModifiedCallback } },
        { domEvent: 'DOMElementNameChanged', callback: { DOMElementNameChanged: this.Callbacks.elementNameChangedCallback } },
        { domEvent: 'DOMNodeInsertedIntoDocument', callback: { DOMNodeInsertedIntoDocument: this.Callbacks.nodeInsertedIntoDocumentCallback } },
        { domEvent: 'DOMNodeInserted', callback: { DOMNodeInserted: this.Callbacks.nodeInsertedCallback } },
        { domEvent: 'DOMNodeRemoved', callback: { DOMNodeRemoved: this.Callbacks.nodeRemovedCallback } },
        { domEvent: 'DOMNodeRemovedFromDocument', callback: { DOMNodeRemovedFromDocument: this.Callbacks.removedFromDocumentCallback } },
        { domEvent: 'DOMSubtreeModified', callback: { DOMSubtreeModified: this.Callbacks.subtreeModifiedCallback } }];

        this.configureCallback(this.virtual);
    }

    configureCallback(doc) {
        if (this.virtual) {
            this.arrayCallbacks.forEach(event => {
                this.virtual.addEventListener(event.domEvent, (mutationEvent) => {
                    event.callback[event.domEvent](doc, mutationEvent);
                });
            });
        }
    }

    apply() {
        document.body.innerHTML = this.virtual.body.innerHTML;

        return;
    }

    getCallback(eventName) {
        for (let i in this.arrayCallbacks) {
            if (this.arrayCallbacks[i].domEvent == eventName) {
                return this.arrayCallbacks[i].callback[eventName];
            }
        }

        return null;
    }

    setCallback(eventName, func) {
        for (let i in this.arrayCallbacks) {
            if (this.arrayCallbacks[i].domEvent == eventName) {
                this.arrayCallbacks[i].callback[eventName] = func;
            }
        }

        return;
    }

    body() {

        let body = this.virtual.body;

        body.setHtml = (stringTemplate) => {
            body.innerHTML = stringTemplate;

            return;
        };

        body.getHtml = () => {
            return body.innerHTML;
        };

        return body;
    }
}

//TEST para route
class HashHandler {
    constructor() {
        this.oldHash = window.location.hash;
        this.Check;
    }

    detect() {
        if (this.oldHash != window.location.hash) {
            alert("HASH CHANGED - new has" + window.location.hash);
            this.oldHash = window.location.hash;
        }
    }
}

(() => {
    // A hash to store our routes:
    let routes = {};
    // An array of the current route's events:
    let events = [];
    // The element where the routes are rendered:
    let el = null;
    // Context functions shared between all controllers:
    let ctx = {
        on: (selector, evt, handler) => {
            events.push([selector, evt, handler]);
        },
        refresh: (listeners) => {
            listeners.forEach((fn) => { fn(); });
        }
    };

    // Defines a route:
    let route = (path, templateId, controller) => {
        if (typeof templateId === 'function') {
            controller = templateId;
            templateId = null;
        }

        let listeners = [];
        Object.defineProperty(controller.prototype, '$on', { value: ctx.on });
        Object.defineProperty(controller.prototype, '$refresh', { value: ctx.refresh.bind(undefined, listeners) });

        routes[path] = { templateId: templateId, controller: controller, onRefresh: listeners.push.bind(listeners) };
    };

    const forEachEventElement = (fnName) => {
        for (let i = 0, len = events.length; i < len; i++) {
            let els = el.querySelectorAll(events[i][0]);
            for (let j = 0, elsLen = els.length; j < elsLen; j++) {
                els[j][fnName].apply(els[j], events[i].slice(1));
            }
        }
    };

    const addEventListeners = () => {
        forEachEventElement('addEventListener');
    };

    const removeEventListeners = () => {
        forEachEventElement('removeEventListener');
    };

    //Watch changes on the View
    const calls = {
        attribModifiedCallback: (element, event) => {

        },
        attribNameChangedCallback: (element, event) => {

        },
        characterDataModifiedCallback: (element, event) => {

        },
        elementNameChangedCallback: (element, event) => {

        },
        nodeInsertedIntoDocumentCallback: (element, event) => {

        },
        nodeInsertedCallback: (element, event) => {

        },
        nodeRemovedCallback: (element, event) => {

        },
        removedFromDocumentCallback: (element, event) => {

        },
        subtreeModifiedCallback: (element, event) => {

        },
    };

    let arrayCallbacks = [{ domEvent: 'DOMAttrModified', callback: { DOMAttrModified: calls.attribModifiedCallback } },
    { domEvent: 'DOMAttributeNameChanged', callback: { DOMAttributeNameChanged: calls.attribNameChangedCallback } },
    { domEvent: 'DOMCharacterDataModified', callback: { DOMCharacterDataModified: calls.characterDataModifiedCallback } },
    { domEvent: 'DOMElementNameChanged', callback: { DOMElementNameChanged: calls.elementNameChangedCallback } },
    { domEvent: 'DOMNodeInsertedIntoDocument', callback: { DOMNodeInsertedIntoDocument: calls.nodeInsertedIntoDocumentCallback } },
    { domEvent: 'DOMNodeInserted', callback: { DOMNodeInserted: calls.nodeInsertedCallback } },
    { domEvent: 'DOMNodeRemoved', callback: { DOMNodeRemoved: calls.nodeRemovedCallback } },
    { domEvent: 'DOMNodeRemovedFromDocument', callback: { DOMNodeRemovedFromDocument: calls.removedFromDocumentCallback } },
    { domEvent: 'DOMSubtreeModified', callback: { DOMSubtreeModified: calls.subtreeModifiedCallback } }];

    const compare = (data) => {
        if (sessionStorage && sessionStorage.currentDocument) {
            let obj = sessionStorage.currentDocument || {};
            let dom = sessionStorage.currentDocument || {};

            obj = JSON.parse(obj);
            dom = JSON.parse(dom);

            if (!obj || !dom) return true;

            for (let src in data) {
                if (data[src] != dom[src]) {
                    return true;
                }
            }

            return false;
        }

        return true;
    };

    //Cache
    const tmpl = (str, data) => {

        //if (compare(data)) {
        let dom = new VDom();

        let dataReplaced;

        for (let i in data) {
            let regExpression = new RegExp('{{' + i + '}}');
            str = str.replace(regExpression, data[i]);
        }

        dom.body().setHtml(str);
        sessionStorage.currentDocument = JSON.stringify({ doc: dom, obj: data });

        dom.apply();
        /*} else {
            sessionStorage.currentDocument.doc.apply();
        }*/
    };

    let current = null;
    const router = () => {
        // Lazy load view element:
        el = el || document.getElementById('view');
        // Clear existing observer:
        if (current) {
            current = null;
        }
        // Current route url (getting rid of '#' in hash as well):
        var url = location.hash.slice(1) || '/';
        // Get route by url:
        var route = routes[url];
        // Do we have both a view and a route?
        if (el && route && route.controller) {
            // Set current route information:
            current = {
                controller: new route.controller,
                template: route.templateId,
                render: () => {
                    // Render route template with John Resig's template engine:
                    el.innerHTML = tmpl(route.templateId, new route.controller());
                    window.history.pushState(url, url);
                }
            };
            // Render directly:
            current.render();

            //Configure watchs
            arrayCallbacks.forEach(event => {
                el.addEventListener(event.domEvent, (mutationEvent) => {
                    event.callback[event.domEvent](el, mutationEvent);
                });
            });
        }
    };
    // Listen on hash change:
    this.addEventListener('hashchange', router);
    // Listen on page load:
    this.addEventListener('load', router);
    // Expose the route register function:
    this.route = route;
})();

HTMLElement.prototype.renderPartial = (url, params) => {

    fetch(url)
        .then((response) => {
            return response.blob();
        })
        .then((response) => {
            this.innerHTML = response.data ? response.data : response;
        }).catch((ex) => {
            throw ex;
        });
};

/*
setInterval(()=>{

    let currentLocation = window.location.href;

}, 10);
*/

/*                                                          END CORE                                                                    */
/****************************************************************************************************************************************/

//Ready
document.addEventListener('DOMContentLoaded', () => {

    //Set up this document
    let vdom = new VDom();

    vdom.setCallback('DOMNodeInserted', (event) => {
        console.log("Agregado", event);
    });

    vdom.body().setHtml(`<h1>{{pepe}}</h1>`);

    route('/page1', vdom.body().getHtml(), function () {
        this.pepe = 'Hello world!';
        this.counter = 0;
        this.$on('.my-button', 'click', function () {
            this.counter += 1;
            this.$refresh();
        }.bind(this));
    });
});