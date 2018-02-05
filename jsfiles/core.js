/****************************************************************************************************************************************/

/*                                                          CORE                                                                        */
/****************************************************************************************************************************************/
'use strict';

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

    constructor(template = {}, data = {}, format = 'text/html') {
        this._template = template;
        this._format = format;
        this._events = [];
        this._data = data;

        this._events.data = data;

        this.virtual = createDOM(this._template.original, this._format);

        this.Callbacks = {

            attribModifiedCallback: (event) => {
                
            },
            attribNameChangedCallback: (event) => {
                
            },
            characterDataModifiedCallback: (event) => {
                $applyChanges();

            },
            elementNameChangedCallback: (event) => {

            },
            nodeInsertedIntoDocumentCallback: (event) => {
                $applyChanges();

            },
            nodeInsertedCallback: (event) => {
                

            },
            nodeRemovedCallback: (event) => {
                
            },
            removedFromDocumentCallback: (event) => {
                $applyChanges();

            },
            subtreeModifiedCallback: (event) => {

            },
            ready: (event) => {

            }
        };

        this.arrayCallbacks = [{ domEvent: 'DOMAttrModified', callback: { DOMAttrModified: this.Callbacks.attribModifiedCallback } },
        { domEvent: 'DOMAttributeNameChanged', callback: { DOMAttributeNameChanged: this.Callbacks.attribNameChangedCallback } },
        { domEvent: 'DOMCharacterDataModified', callback: { DOMCharacterDataModified: this.Callbacks.characterDataModifiedCallback } },
        { domEvent: 'DOMElementNameChanged', callback: { DOMElementNameChanged: this.Callbacks.elementNameChangedCallback } },
        { domEvent: 'DOMNodeInsertedIntoDocument', callback: { DOMNodeInsertedIntoDocument: this.Callbacks.nodeInsertedIntoDocumentCallback } },
        { domEvent: 'DOMNodeInserted', callback: { DOMNodeInserted: this.Callbacks.nodeInsertedCallback } },
        { domEvent: 'DOMNodeRemoved', callback: { DOMNodeRemoved: this.Callbacks.nodeRemovedCallback } },
        { domEvent: 'DOMNodeRemovedFromDocument', callback: { DOMNodeRemovedFromDocument: this.Callbacks.removedFromDocumentCallback } },
        { domEvent: 'DOMSubtreeModified', callback: { DOMSubtreeModified: this.Callbacks.subtreeModifiedCallback } },
        { domEvent: 'DOMContentLoaded', callback: { DOMContentLoaded: this.Callbacks.ready } }];

        this.configureCallback(this.virtual);
    }

    applyChanges() {
        $applyChanges();
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

    setActionCallback(selector, event, action) {
        if (this.virtual) {
            this._events.push({ selector: selector, event: event, action: action });
        }

        return true;
    }

    apply() {
        document.body.innerHTML = this.virtual.body.innerHTML;

        for (let i in this._events) {
            let item = this._events[i];

            let element = document.querySelector(item.selector);
            let dataSource = this._data;
            if (element) {
                element.addEventListener(item.event, function (eventHandler) {
                    item.action(eventHandler, dataSource);
                });
            }
        }

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

    getElementById(id) {
        return this.virtual.getElementById(id);
    }

    getElementByQuery(query) {
        return this.virtual.querySelector(query);
    }

    getElementByTagName(tagName) {
        return this.virtual.getElementByTagName(tagName);
    }

    getElementsByTagName(tagName) {
        return this.virtual.getElementsByTagName(tagName);
    }

    getElementsByQuery(query) {
        return this.virtual.querySelectorAll(query);
    }

    setVar(varName, obj) {
        document[varName] = obj;
    }

    getVar(varName) {
        return document[varName];
    }

    body() {

        let body = this.virtual.body;

        body.setHtml = (stringTemplate) => {
            if(stringTemplate && stringTemplate.format){
                body.innerHTML = stringTemplate.logic;
            } else if(stringTemplate && stringTemplate.logic) {
                body.innerHTML = stringTemplate.logic;
            } else if(typeof(stringTemplate) == 'string'){
                body.innerHTML = stringTemplate;
            }

            return;
        };

        body.getHtml = () => {
            return body.innerHTML;
        };

        return body;
    }

    head() {

        let head = this.virtual.head;

        head.setHtml = (stringTemplate) => {
            head.innerHTML = stringTemplate;

            return;
        };

        head.getHtml = () => {
            return head.innerHTML;
        };

        return head;
    }
}

(() => {
    //Clear sessionStorage
    sessionStorage.clear();

    //Routes
    let routes = {};

    // An array of the current route's events:
    let events = [];

    // The element where the routes are rendered:
    let el = null;

    // Defines a route:
    let route = (path, templateId) => {
        routes[path] = { templateId: templateId };
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
            

        }
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

    const isObject = (obj) => {
        return typeof (obj) == 'object' && !(obj.length) ? true : false;
    };

    const replacerObject = (source, data, proper, firstProp) => {
        let stringReplaced = source;
        let regex = undefined;

        regex = new RegExp(`{{${proper}.${firstProp}}}`, 'g');
        let parent = `{{)([aA-zZ]{0,}`;

        if (!source.match(regex)) {
            regex = new RegExp(`(${parent}).(${proper}).(${firstProp})(}})`, 'g');

            let tries = 20;
            while (!source.match(regex)) {
                current = `(${parent}).(${parent}).(${proper}).(${firstProp})(}})`
                regex = new RegExp(current, 'g');

                current += `(${parent}).`;
                tries--;

                if (tries <= 1) break;
            }
        }

        stringReplaced = stringReplaced.replace(regex, data[firstProp]);

        return stringReplaced;
    };

    const replaceCode = (str, data, proper = '', subchild = false) => {

        let source = str;

        for (let prop in data) {
            if (isObject(data[prop])) {

                source = replaceCode(source, data[prop], prop, true);
            } else if (subchild) {
                let regex = undefined;

                regex = new RegExp(`{{${proper}.${prop}}}`, 'g');
                if (!source.match(regex)) {
                    source = replacerObject(source, data, proper, prop);
                } else {
                    source = source.replace(regex, data[prop]);
                }
            } else {
                let regex = new RegExp(`{{${prop}}}`, 'g');
                source = source.replace(regex, data[prop]);
            }
        }

        return source;
    };

    //Cache
    const tmpl = (dom) => {

        let dataReplaced = replaceCode(dom._template.format, dom._data);

        dom.body().setHtml(dataReplaced);

        dom.apply();
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
        if (el && route && route.templateId) {
            // Set current route information:
            current = {
                controller: route.templateId._data,
                template: route.templateId,
                render: () => {

                    let htmlCode = tmpl(route.templateId);
                    el.innerHTML = htmlCode;

                    let urlSet = url.substring(1);
                    if (window.location.href.indexOf('file:///') >= 0) {
                        window.history.pushState({ "html": htmlCode, "pageTitle": urlSet }, "", `#/${urlSet}`);
                    } else {
                        window.history.pushState({ "html": htmlCode, "pageTitle": urlSet }, "", urlSet);
                    }
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
    this.$applyChanges = router;

    //Watch router
    setInterval(() => {

        let currentLocation = window.location.href;

        if (currentLocation.indexOf('#') >= 0) {
            let view = `${currentLocation.split('#')[1]}`;

            sessionStorage.current = view;

            if (sessionStorage.previous && sessionStorage.previous != view) {
                if (routes[view]) {
                    tmpl(routes[view].templateId);
                    sessionStorage.previous = view;
                } else {
                    document.body.innerHTML = `<h1>Not Found</h1><br/><p>Sorry but VMDom not found any page to show</p>`;
                }
            } else {
                sessionStorage.previous = view;
            }


        }

    }, 1000);
})();

class Template {
    constructor(stringCode){
        this.format = stringCode;
        this.logic = stringCode;
    }
}

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

/*                                                          END CORE                                                                    */
/****************************************************************************************************************************************/

//Ready
document.addEventListener('DOMContentLoaded', () => {

    let homeView = new Template(`
        <h1>{{pepe}}</h1>
        <h2>{{counter}}</h2>
        <button class="my-button">Increment</button>`);

    //Set up this document
    let vdom = new VDom(homeView, {
        pepe: 'Hello world!',
        counter: 0
    });

    vdom.body().setHtml(homeView);

    vdom.setActionCallback('.my-button', 'click', (event, data) => {
        data.counter++;

        vdom.applyChanges();
    });

    route('/page1', vdom);

});