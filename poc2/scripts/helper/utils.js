define(function () {
    'use strict';

    function extend(dest, src, options) {
        if (src) {
            Object.keys(src).forEach(function (key) {
                dest[key] = src[key];
            });
        }
        if (options) {
            Object.keys(options).forEach(function (key) {
                dest[key] = options[key];
            });
        }
        return (dest);
    }

    function isString(s) {
        return typeof (s) === 'string' || s instanceof String;
    }
    function isDOMElement(obj) {
        return (obj instanceof HTMLElement);
    }
    function isNodeList(obj) {
        var stringRepr = Object.prototype.toString.call(obj);
        return typeof obj === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
            'length' in obj &&
            (obj.length === 0 || (typeof obj[0] === "object" && obj[0].nodeType > 0));
    }

    var El$$ = function (sel, parentContainer) { // sel : css selector, dom element, node list or El$$ object
        if (sel instanceof El$$) {
            return sel;
        } else if (isString(sel)) {
            var container = parentContainer || document;
            this.els = Array.prototype.slice.call(container.querySelectorAll(sel));
        } else if (isDOMElement(sel)) {
            this.els = [sel];
        } else if (isNodeList(sel)) {
            this.els = Array.prototype.slice.call(sel);
        } else if (Array.isArray(sel)) {
            this.els = sel;
        } else {
            this.els = [];
        }
        this.length = this.els.length;
    };

    var $$utils = {
        parse : function (str) {
            var tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = str;
            return new El$$(tmp.body.children);
        },
        ready : function (fn) {
            if (document.readyState !== 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        },
        extend : extend
    };

    var $$fn = {
        each : function (fn) {
            this.els.forEach(fn);
        },
        append : function (s) {
            var nodes = [], res = [];
            if (isString(s)) {
                nodes = $$utils.parse(s);
            } else {
                nodes = new El$$(s);
            }
            this.each(function (el) {
                nodes.each(function (node) {
                    el.appendChild(node);
                    res.push(node);
                });
            });
            return new El$$(res);
        },
        appendHTML : function (s) {
            this.each(function (el) {
                el.innerHTML += s;
            });
            return this.children();
        },
        hide : function () {
            this.each(function (el) {
                el.style.display = 'none';
            });
            return this;
        },
        show : function () {
            this.each(function (el) {
                el.style.display = 'block';
            });
            return this;
        },
        on : function (eventName, eventHandler) {
            this.each(function (el) {
                el.addEventListener(eventName, eventHandler);
            });
            return this;
        },
        off : function (eventName, eventHandler) {
            this.each(function (el) {
                el.removeEventListener(eventName, eventHandler);
            });
            return this;
        },
        addClass: function (className) {
            this.each(function (el) {
                if (el.classList) {
                    el.classList.add(className);
                } else {
                    el.className += ' ' + className;
                }
            });
            return this;
        },
        removeClass : function (className) {
            this.each(function (el) {
                if (el.classList) {
                    el.classList.remove(className);
                } else {
                    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            });
            return this;
        },
        html : function (s) {
            this.each(function (el) {
                el.innerHTML = s;
            });
            return this;
        },
        children : function () {
            var c = [];
            this.each(function (el) {
                var cEl = Array.prototype.slice.call(el.children);
                c = c.concat(cEl);
            });
            return new El$$(c);
        },
        delay : function (fn, args, ms) {
            var self = this;
            setTimeout(function () {
                self[fn].apply(self, args);
            }, ms);
            return this;
        },
        animate : function (prop, val, ms) {
            if (this.els.length === 0) {
                return this;
            }
            var fnName = (prop in this.els[0]) ? "prop" : "style";
            var init = (this[fnName](prop)).toString().match(/^([+\-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/),
                srcVal = init[1],
                unit = init[2],
                step = 50,
                currStep = 0,
                valStep = (val - srcVal) / (ms / 50),
                currVal = srcVal,
                self = this,
                interval = setInterval(function () {
                    currVal += valStep;
                    currStep += step;
                    if (currStep > ms) {
                        self[fnName](prop, val + unit);
                        clearInterval(interval);
                        return self;
                    }
                    self[fnName](prop, parseInt(currVal, 10) + unit);
                }, step);
            return this;
        },
        prop : function (prop, val) {
            if (val) {
                this.each(function (el) {
                    el[prop] = val;
                });
                return this;
            } else {
                if (this.els.length > 0) {
                    var el = this.els[0];
                    return (prop in el) ? this.els[0][prop] : null;
                }
            }
        },
        style : function (prop, val) {
            if (val) {
                this.each(function (el) {
                    el.style[prop] = val;
                });
                return this;
            } else {
                if (this.els.length > 0) {
                    var el = this.els[0];
                    var currCss = window.getComputedStyle(el, null);
                    return currCss.getPropertyValue(prop);
                }
            }
        },
        offset : function () {
            if (this.els.length > 0) {
                var rect = this.els[0].getBoundingClientRect();
                return ({
                    top: rect.top + document.body.scrollTop,
                    left: rect.left + document.body.scrollLeft,
                    width: rect.width,
                    height : rect.height
                });
            }
        }
    };

    extend(El$$.prototype, $$fn);

    return {
        random : function () {
            return parseInt(Math.random() * 100000, 10);
        },
        addDelay : function (startTime, delay) {
            var delayMs,
                count = parseInt(delay, 10);
            if (!delay || delay === 0) {
                return startTime;
            }

            switch (delay.slice(-1)) {
            case "s": //seconds
                delayMs = count * 1000;
                break;
            case "h": //hour
                delayMs = count * 1000 * 60 * 60;
                break;
            case "d": // days
                delayMs = count * 1000 * 60 * 60 * 24;
                break;
            default: //"m" is for minutes
                delayMs = count * 1000 * 60;
                break;
            }
            return (new Date(startTime.getTime() + delayMs));
        },
        $$ : function (s) {
            return !!s ? new El$$(s) : $$utils;
        }
    };
});
