'use strict';

var jLinq = (function () {

	/*
	 * Determines whether all elements of a sequence satisfy a
	 * condition.
	 * 
	 * @param {Function} predicate
	 * @return {Boolean} all
	 */
    Array.prototype.all = function (predicate) {
        if (!predicate) {
            throw new Error('Invalid predicate.');
        }

        for (let item of this) {
            if (predicate(item) === false) {
                return false;
            }
        }

        return true;
    };

	/*
	 * Determines whether any element of a sequence satisfies a
	 * condition. If no predicate is provided, then it returns
	 * whether the sequence contains any elements.
	 * 
	 * @param {Function} predicate
	 * @return {Boolean} any
	 */
    Array.prototype.any = function (predicate) {
        if (!predicate) {
            return this.length > 0;
        }

        for (let item of this) {
            if (predicate(item) === true) {
                return true;
            }
        }

        return false;
    };

	/*
	 * Computes the average of a sequence of numeric values that
	 * are obtained by invoking a transform function on each
	 * element of the input sequence.
	 * 
	 * @param {Function} selector
	 * @return {Number} average
	 */
    Array.prototype.average = function (selector) {
        if (selector === undefined) {
            throw new Error('Invalid selector.');
        }

        else if (Object.prototype.toString.call(selector) != '[object Function]') {
            throw new Error('Invalid selector.');
        }

        return [0].concat(this).reduce((x, y) => x + selector(y)) / this.length;
    };

	/*
	 * Determines whether a sequence contains a specified element
	 * by using a specified comparer.
	 *  
	 * @param {any} value
	 * @param {Function} comparer	 
	 * @returns {Boolean}
	 */
    Array.prototype.contains = function (value, comparer) {
        if (value === undefined) {
            throw new Error('Expected a value.');
        }

        else if (comparer !== undefined) {
            if (Object.prototype.toString.call(comparer) != '[object Function]') {
                throw new Error('Invalid comparer.');
            }
        }

        else {
            comparer = (x, y) => x == y;
        }

        for (let item of this) {
            if (comparer(item, value)) {
                return true;
            }
        }

        return false;
    };

	/*
	 * Returns a number that represents how many elements in the
	 * specified sequence satisfy a condition. If no predicate
	 * is provided, then it returns de number of elements in the
	 * sequence.
	 * 
	 * @param {Function} predicate	 
	 * @return {Number} count
	 */
    Array.prototype.count = function (predicate) {
        if (predicate === undefined) {
            return this.length;
        }

        else if (predicate !== undefined) {
            if (Object.prototype.toString.call(predicate) != '[object Function]') {
                throw new Error('Invalid predicate.');
            }
        }

        return this.filter(predicate).length;
    };

	/*
	 * Returns the elements of the specified sequence or the specified value in
	 * a singleton collection if the sequence is empty. If the sequence is
	 * empty and no default value is provided, then it returns the sequence's
	 * type default value in a singleton collection.
	 * 
	 * @param {any} defaultValue	 
	 * @return {Array}
	 */
    Array.prototype.defaultIfEmpty = function (defaultValue) {
        if (defaultValue === undefined) {
            throw new Error('Expected a default value.');
        }

        return this.length == 0 ? [defaultValue] : this.copyWithin([]);
    };

	/*
	 * Returns distinct elements from a sequence by using a specified
	 * comparer to compare values. If no comparer is provided, it uses the
	 * default comparer.
	 * 
	 * @param {Function} comparer
	 * @return {Array}
	 */
    Array.prototype.distinct = function (comparer) {
        let result = [];
        for (let i in this) {
            var first = this[i];
            for (let e in this) {
                if (first instanceof Object) {
                    for (let property in first) {

                    }
                }
            }
        }
    };

	/*
	 * Returns a object that represents the value in the predicate
	 *
	 * @param {Function} predicate
	 * @return {Object} object
	 */
    Array.prototype.firstOrDefault = function (predicate) {
        if (predicate === undefined) {
            if (this.length > 0) return this[0];
            return null;
        }

        else if (predicate !== undefined) {
            if (this.length > 0)
                return this[0];
            else
                return null;
        }

        for (let i in this) {
            if (predicate(this[i]) === true) {
                return this[i];
            }
        }

        return null;
    };

    Array.prototype.lastOrDefault = function (predicate) {
        if (predicate === undefined) {
            if (this.length > 0) return this[this.length - 1];
            return null;
        }

        else if (predicate !== undefined) {
            if (this.length > 0)
                return this[this.length - 1];
            else
                return null;
        }

        for (let i in this) {
            if (predicate(this[i]) === true) {
                return this[i];
            }
        }

        return null;
    };

    Array.prototype.remove = function (predicate) {
        let result = [];
        for (let i in this) {
            if (predicate(this[i]) !== true && !(this instanceof Function))
                result.push(this[i]);
        }

        return result;
    };

	/*
	 * Projects each element of a sequence into a new form.
	 *
	 * @param {Function} selector	 
	 * @return {Object} select
	 */
    Array.prototype.select = function (selector) {
        return this.map(selector);
    };

    Array.prototype.selectMany = function (predicate) {
        let result = [];
        for (let i in this) {
            if (predicate(this[i]) === true)
                result.push(this[i]);
        }

        return result;
    };

	/*
	 * Returns an object list that represents the value in the predicate
	 *
	 * @param {Function} predicate
	 * @return {Object} object list
	 */
    Array.prototype.where = function (predicate) {
        if (predicate === undefined) {
            return this.length;
        }

        else if (predicate !== undefined) {
            if (Object.prototype.toString.call(predicate) != '[object Function]') {
                throw new Error('Invalid predicate.');
            }
        }

        return this.filter(predicate);
    };


    
    /**
     * Repeat it on NodeList
     */


    /*
    * Determines whether all elements of a sequence satisfy a
    * condition.
    * 
    * @param {Function} predicate
    * @return {Boolean} all
    */
    NodeList.prototype.all = function (predicate) {
        if (!predicate) {
            throw new Error('Invalid predicate.');
        }

        for (let item of this) {
            if (predicate(item) === false) {
                return false;
            }
        }

        return true;
    };

	/*
	 * Determines whether any element of a sequence satisfies a
	 * condition. If no predicate is provided, then it returns
	 * whether the sequence contains any elements.
	 * 
	 * @param {Function} predicate
	 * @return {Boolean} any
	 */
    NodeList.prototype.any = function (predicate) {
        if (!predicate) {
            return this.length > 0;
        }

        for (let item of this) {
            if (predicate(item) === true) {
                return true;
            }
        }

        return false;
    };

	/*
	 * Computes the average of a sequence of numeric values that
	 * are obtained by invoking a transform function on each
	 * element of the input sequence.
	 * 
	 * @param {Function} selector
	 * @return {Number} average
	 */
    NodeList.prototype.average = function (selector) {
        if (selector === undefined) {
            throw new Error('Invalid selector.');
        }

        else if (Object.prototype.toString.call(selector) != '[object Function]') {
            throw new Error('Invalid selector.');
        }

        return [0].concat(this).reduce((x, y) => x + selector(y)) / this.length;
    };

	/*
	 * Determines whether a sequence contains a specified element
	 * by using a specified comparer.
	 *  
	 * @param {any} value
	 * @param {Function} comparer	 
	 * @returns {Boolean}
	 */
    NodeList.prototype.contains = function (value, comparer) {
        if (value === undefined) {
            throw new Error('Expected a value.');
        }

        else if (comparer !== undefined) {
            if (Object.prototype.toString.call(comparer) != '[object Function]') {
                throw new Error('Invalid comparer.');
            }
        }

        else {
            comparer = (x, y) => x == y;
        }

        for (let item of this) {
            if (comparer(item, value)) {
                return true;
            }
        }

        return false;
    };

	/*
	 * Returns a number that represents how many elements in the
	 * specified sequence satisfy a condition. If no predicate
	 * is provided, then it returns de number of elements in the
	 * sequence.
	 * 
	 * @param {Function} predicate	 
	 * @return {Number} count
	 */
    NodeList.prototype.count = function (predicate) {
        if (predicate === undefined) {
            return this.length;
        }

        else if (predicate !== undefined) {
            if (Object.prototype.toString.call(predicate) != '[object Function]') {
                throw new Error('Invalid predicate.');
            }
        }

        return this.filter(predicate).length;
    };

	/*
	 * Returns the elements of the specified sequence or the specified value in
	 * a singleton collection if the sequence is empty. If the sequence is
	 * empty and no default value is provided, then it returns the sequence's
	 * type default value in a singleton collection.
	 * 
	 * @param {any} defaultValue	 
	 * @return {Array}
	 */
    NodeList.prototype.defaultIfEmpty = function (defaultValue) {
        if (defaultValue === undefined) {
            throw new Error('Expected a default value.');
        }

        return this.length == 0 ? [defaultValue] : this.copyWithin([]);
    };

	/*
	 * Returns distinct elements from a sequence by using a specified
	 * comparer to compare values. If no comparer is provided, it uses the
	 * default comparer.
	 * 
	 * @param {Function} comparer
	 * @return {Array}
	 */
    NodeList.prototype.distinct = function (comparer) {
        let result = [];
        for (let i in this) {
            var first = this[i];
            for (let e in this) {
                if (first instanceof Object) {
                    for (let property in first) {

                    }
                }
            }
        }
    };

	/*
	 * Returns a object that represents the value in the predicate
	 *
	 * @param {Function} predicate
	 * @return {Object} object
	 */
    NodeList.prototype.firstOrDefault = function (predicate) {
        if (predicate === undefined) {
            if (this.length > 0) return this[0];
            return null;
        }

        else if (predicate !== undefined) {
            if (this.length > 0)
                return this[0];
            else
                return null;
        }

        for (let i in this) {
            if (predicate(this[i]) === true) {
                return this[i];
            }
        }

        return null;
    };

    NodeList.prototype.lastOrDefault = function (predicate) {
        if (predicate === undefined) {
            if (this.length > 0) return this[this.length - 1];
            return null;
        }

        else if (predicate !== undefined) {
            if (this.length > 0)
                return this[this.length - 1];
            else
                return null;
        }

        for (let i in this) {
            if (predicate(this[i]) === true) {
                return this[i];
            }
        }

        return null;
    };

    NodeList.prototype.remove = function (predicate) {
        let result = [];
        for (let i in this) {
            if (predicate(this[i]) !== true && !(this instanceof Function))
                result.push(this[i]);
        }

        return result;
    };

	/*
	 * Projects each element of a sequence into a new form.
	 *
	 * @param {Function} selector	 
	 * @return {Object} select
	 */
    NodeList.prototype.select = function (selector) {
        return this.map(selector);
    };

    NodeList.prototype.selectMany = function (predicate) {
        let result = [];
        for (let i in this) {
            if (predicate(this[i]) === true)
                result.push(this[i]);
        }

        return result;
    };

	/*
	 * Returns an object list that represents the value in the predicate
	 *
	 * @param {Function} predicate
	 * @return {Object} object list
	 */
    NodeList.prototype.where = function (predicate) {
        if (predicate === undefined) {
            return this.length;
        }

        else if (predicate !== undefined) {
            if (Object.prototype.toString.call(predicate) != '[object Function]') {
                throw new Error('Invalid predicate.');
            }
        }

        return this.filter(predicate);
    };

}());