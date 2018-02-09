/****************************************************************************************************************************************/

/*                                                          CORE                                                                        */
/****************************************************************************************************************************************/
'use strict';

const configDefault = { attributes: true, childList: true, characterData: true };
sessionStorage.rendered = false;

//Time to check URL's
let timeToCheck = 500;

//Default configuration to MVC
let defaultControllerMVC = {
    controller: 'Home',
    action: 'Index'
};

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
                    $applyChanges();
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
            if (stringTemplate && stringTemplate.format) {
                body.innerHTML = stringTemplate.logic;
            } else if (stringTemplate && stringTemplate.logic) {
                body.innerHTML = stringTemplate.logic;
            } else if (typeof (stringTemplate) == 'string') {
                body.innerHTML = stringTemplate;
            }

            return;
        };

        body.getHtml = () => {
            return body.innerHTML;
        };

        return body;
    }

    render(stringTemplate) {

        let docum = this.virtual.write;
        if (stringTemplate && stringTemplate.format) {
            docum.innerHTML = stringTemplate.logic;
        } else if (stringTemplate && stringTemplate.logic) {
            docum.innerHTML = stringTemplate.logic;
        } else if (typeof (stringTemplate) == 'string') {
            docum.innerHTML = stringTemplate;
        }
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

    addToRouter(routeToAdd) {
        route(routeToAdd, this);
    }

    setProp(prop, value) {
        if (this[prop]) {
            this[prop] = value;
            this.applyChanges();
        }
    }

    getProp(prop) {
        if (this[prop]) {
            return this[prop];
        }
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

    const replaceCode = (str, data, proper = '', subchild = false, applied = false) => {

        let source = str;

        //Esta en mejora todavía, no funciona bien.
        if (!applied) {
            source = applyLogic(str, new DOMParser().parseFromString(str, 'text/html'), data);
        }

        for (let prop in data) {
            if (isObject(data[prop])) {

                source = replaceCode(source, data[prop], prop, true, true);
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

    const getAttribute = (element, attributeName) => {
        if (element && element.attributes) {
            for (let i in element.attributes) {
                if (element.attributes[i].name == attributeName) {
                    return element.attributes[i].value;
                }
            }
        }
    };

    const isFunction = (obj) => {
        return typeof (obj) == 'function' ? true : false;
    };

    const replaceCodeByLogic = (str, data, obj) => {
        let source = str;
        let prop = '([aA-zZ]+)';
        let regex = new RegExp(`{{${obj.iterator}.${prop}}}`, 'g');

        let match = source.match(regex);
        if (match) {
            for (let i in match) {
                if (isFunction(match[i])) break;
                let propName = null;

                if (match[i].split) {
                    propName = match[i].split(".");
                    if (propName && propName.length && propName.length <= 1) {
                        propName = propName.firstOrDefault().replace(/{{/g, '').replace(/}}/g, '');
                    } else {
                        propName = propName.lastOrDefault().replace('}}', '');
                    }
                }

                if (propName == null) break;

                for (let e in data) {
                    if (isFunction(data[e])) break;
                    if (data[e][propName]) {
                        source = source.replace(new RegExp(match[i]), data[e][propName]);
                    } else if (data[propName]) {

                        let matcher = new RegExp(match[i]);

                        if (source.match(matcher)) {
                            source = source.replace(matcher, data[propName]);
                        } else if (source.match('undefined')) {
                            source = source.replace('undefined', data[propName]);
                        }
                    }
                }
            }
        }

        return source;
    };

    const replaceFinal = (str, data, pattern) => {

        let source = str;
        let match = source.match(pattern);

        if (match) {
            source = source.replace(pattern, data);
        }

        return source;
    };

    const applyLogic = (str, doc, data) => {
        let source = str, codeElement = '', pattern = ``, tagName = '';
        let spacesRegex = new RegExp("[#]+", "g");

        let logicList = doc.querySelectorAll('[vdom-if]');

        if (logicList && logicList.length) {
            for (let i in logicList) {
                codeElement = '';
                let element = logicList[i];
                if (!element instanceof HTMLElement || typeof (element) == 'number') break;

                tagName = element.tagName.toLowerCase();

                let attribute = getAttribute(element, 'vdom-if').split(' ');

                let iterator = attribute[0];
                let operator = attribute[1];
                let comparer = attribute[2];

                //Si es una variable en el DOM, le seteamos el valor
                if (data[iterator] != null) {
                    iterator = { value: data[iterator], name: iterator };
                } else {
                    iterator = { value: iterator, name: undefined };
                }

                //Si es una variable en el DOM, le seteamos el valor
                if (data[comparer] != null) {
                    comparer = { value: data[comparer], name: comparer };
                } else {
                    comparer = { value: comparer, name: undefined };
                }

                codeElement = element.innerHTML.replace(/[\n\r]+|([ ]+)/g, '#');

                const replacerIn = (str, data, del) => {
                    let source = str;

                    let nameOrValueIterator = iterator.name == undefined ? iterator : iterator.name;
                    let nameOrValueComparer = comparer.name == undefined ? comparer : comparer.name;

                    if (isObject(nameOrValueIterator)) {
                        nameOrValueIterator = nameOrValueIterator.value;
                    }

                    if (isObject(nameOrValueComparer)) {
                        nameOrValueComparer = nameOrValueComparer.value;
                    }

                    let finPatternCode = `<${tagName} vdom-if=("|')${nameOrValueIterator} ${operator} ${nameOrValueComparer}("|')>${codeElement}</${tagName}>`;

                    finPatternCode = finPatternCode.replace(/[\n\r]+|([ ]+)/g, '#');
                    pattern = new RegExp(finPatternCode, 'g');

                    if (!del) {

                        //Has logic
                        if (codeElement.match(/(({{)(([aA-zZ]+)|([aA-zZ]+.[aA-zZ]+))(}}))/g)) {
                            codeElement = replaceCodeByLogic(codeElement, data, { iterator: iterator, data: data });
                        }

                        let replacedSpaces = source.replace(/[\n\r]+|([ ]+)/g, '#');
                        let preSource = replaceFinal(replacedSpaces, codeElement, pattern);

                        preSource = preSource.replace(new RegExp("[#]+", "g"), " ");

                        source = replaceFinal(replacedSpaces, codeElement, pattern);

                    } else {

                        source = source.replace(/[\n\r]+|([ ]+)/g, '#');

                        let match = source.replace(/[\n\r]+|([ ]+)/g, '#').match(pattern);
                        if (match) {
                            source = source.replace(pattern, '');
                        }

                        source = source.replace(/[\n\r]+|([ ]+)/g, ' ');
                    }

                    return source;
                }

                let preIterator = iterator.value;
                let preComparer = comparer.value;

                switch (operator) {
                    case ">":
                        if (preIterator > preComparer) {
                            source = replacerIn(source, data);
                        } else {
                            source = replacerIn(source, data, true);
                        }
                        break;

                    case "<":
                        if (preIterator < preComparer) {
                            source = replacerIn(source, data);
                        } else {
                            source = replacerIn(source, data, true);
                        }
                        break;

                    case "!=":
                        if (preIterator != preComparer) {
                            source = replacerIn(source, data);
                        } else {
                            source = replacerIn(source, data, true);
                        }
                        break;

                    case ">=":
                        if (preIterator >= preComparer) {
                            source = replacerIn(source, data);
                        } else {
                            source = replacerIn(source, data, true);
                        }
                        break;

                    case "<=":
                        if (preIterator <= preComparer) {
                            source = replacerIn(source, data);
                        } else {
                            source = replacerIn(source, data, true);
                        }
                        break;
                }
            }
        }

        logicList = doc.querySelectorAll('[vdom-repeat]');

        if (logicList && logicList.length) {
            for (let i in logicList) {
                codeElement = '';
                let element = logicList[i];
                if (!element instanceof HTMLElement || typeof (element) == 'number') break;

                tagName = element.tagName.toLowerCase();

                let attribute = getAttribute(element, 'vdom-repeat').split(' ');

                let iterator = attribute[0];
                let list = attribute[attribute.length - 1];

                let elementCode = `<${tagName}>${element.innerHTML}</${tagName}>`;

                if (data[list]) {
                    for (let inc = 0; inc < data[list].length; inc++) {
                        codeElement += elementCode;
                    }

                    let patternCode = codeElement.split ? codeElement.split(`<${tagName}>`)[1].split(`</${tagName}>`).firstOrDefault() : '';
                    let finPatternCode = `<${tagName} vdom-repeat=("|')${iterator} in ${list}("|')>${patternCode}</${tagName}>`;

                    finPatternCode = finPatternCode.replace(/[\n\r]+|([ ]+)/g, '#');
                    pattern = new RegExp(finPatternCode, 'g');

                    codeElement = replaceCodeByLogic(codeElement, data[list], { iterator: iterator, data: list });
                    let replacedSpaces = source.replace(/[\n\r]+|([ ]+)/g, '#');
                    let preSource = replaceFinal(replacedSpaces, codeElement, pattern);

                    preSource = preSource.replace(new RegExp("[#]+", "g"), " ");

                    source = replaceFinal(replacedSpaces, codeElement, pattern);
                }
            }
        }

        return source.replace(spacesRegex, " ");
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
        if ((!route) && routes) {
            let routersList = window.location.href.split('/');

            let last = routersList[routersList.length - 1];
            if (last == "") return;

            route = routes['/' + last];
        }

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

        let currentLocation = window.location.href, view = '';
        let notFoundCode = `<h1>Not Found</h1><br/><p>I'm sorry but VMDom has not found a page to show</p>`;

        if (currentLocation.indexOf('#') >= 0) {
            view = `${currentLocation.split('#')[1]}`;

            sessionStorage.current = view;

            if (sessionStorage.previous && sessionStorage.previous != view) {
                if (routes[view]) {
                    tmpl(routes[view].templateId);
                    sessionStorage.previous = view;
                } else {
                    document.body.innerHTML = notFoundCode;
                }
            } else {
                sessionStorage.previous = view;
            }


        } else {
            if (currentLocation.indexOf('/') >= 0) {
                let contentPath = currentLocation.split('/');
                let last = contentPath.lastOrDefault();
                view = `/${last}`;

                sessionStorage.current = view;

                if (routes[view] && !sessionStorage.rendered) {
                    tmpl(routes[view].templateId);
                    sessionStorage.previous = view;
                    sessionStorage.rendered = true;

                    if (window.location.href.indexOf('aspxerrorpath') >= 0) {
                        window.history.pushState({ "html": document.documentElement.innerHTML, "pageTitle": view.substring(1) }, "", view);
                    }
                } else if (last != "" && routes[view] == null) {
                    if (window.location.href.indexOf('notfound') >= 0) {
                        return;
                    }

                    document.body.innerHTML = notFoundCode;
                    sessionStorage.rendered = false;
                    window.history.pushState({ "html": notFoundCode, "pageTitle": 'notfound' }, "", '/notfound');
                }

            }
        }

    }, timeToCheck);
})();

class Template {
    constructor(stringCode) {
        this.format = stringCode;
        this.logic = stringCode;
    }

    load(url) {
        return fetch(url)
            .then((response) => {
                return response.text();
            })
            .then((response) => {
                this.format = response.data ? response.data : response;
            }).catch((ex) => {
                throw ex;
            });
    }
}

HTMLElement.prototype.renderPartial = (url, params) => {

    fetch(url)
        .then((response) => {
            return response.text();
        })
        .then((response) => {
            this.innerHTML = response.data ? response.data : response;
        }).catch((ex) => {
            throw ex;
        });
};

const doPromise = (funct) => {
    return new Promise((resolve, reject) => {
        doPromise({ resolve: resolve, reject: reject });
    });
};

/*                                                          END CORE                                                                    */
/****************************************************************************************************************************************/