// Generated by IcedCoffeeScript 1.4.0c
(function() {
  var classwitharguments, tapcb, tapcbplain, tapclass, tapfn, tapfunction, tapobject, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  classwitharguments = function(f, args) {
    var WrappedClass;
    return WrappedClass = (function(_super) {

      __extends(WrappedClass, _super);

      function WrappedClass() {
        WrappedClass.__super__.constructor.apply(this, args);
      }

      return WrappedClass;

    })(f);
  };

  tapclass = function(target, delegate) {
    var Tap;
    return Tap = (function() {

      function Tap() {
        var delegateclass, fn, name, options, targetclass, value, _i, _len, _ref;
        targetclass = classwitharguments(target, arguments);
        this.target = new targetclass;
        if (delegate != null) {
          delegateclass = classwitharguments(delegate, arguments);
          this.delegate = new delegateclass;
        } else {
          this.delegate = this;
        }
        _ref = _.functions(this.target);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          name = _ref[_i];
          fn = this.target[name];
          options = {
            delegate: this.delegate
          };
          if (this.delegate[name] != null) {
            value = this.delegate[name];
            if (_.isFunction(value)) {
              options.fn = value;
            } else if (_.isObject(value)) {
              options = _.extend(options, value);
            }
          }
          this[name] = tapfunction(this.target, fn, options);
        }
      }

      return Tap;

    })();
  };

  tapobject = function(target, delegate) {
    var fn, name, options, result, value, _i, _len, _ref;
    result = {};
    _ref = _.functions(target);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      fn = target[name];
      options = {
        delegate: delegate
      };
      if (delegate[name] != null) {
        value = delegate[name];
        if (_.isFunction(value)) {
          options.fn = value;
        } else if (_.isObject(value)) {
          options = value;
        }
      }
      result[name] = tapfunction(target, fn, options);
    }
    return result;
  };

  tapfunction = function(target, fn, options) {
    var result;
    result = function() {
      return fn.apply(target, arguments);
    };
    if ((options.fn != null) && _.isFunction(options.fn)) {
      result = tapfn(target, result, options.delegate, options.fn);
    }
    if ((options.cb != null) && _.isFunction(options.cb)) {
      result = tapcb(target, result, options.delegate, options.cb);
    }
    return result;
  };

  tapfn = function(target, targetfn, delegate, delegatefn) {
    return function() {
      var result, tapped;
      result = delegatefn.apply(delegate, arguments);
      if ((result != null) && _.isFunction(result)) {
        tapped = tapcbplain(target, targetfn, delegate, result);
        tapped.apply(delegate, arguments);
        return;
      }
      return targetfn.apply(target, arguments);
    };
  };

  tapcb = function(target, fn, delegate, callback) {
    return function() {
      var args, cb, cbargs;
      args = Array.prototype.slice.call(arguments);
      cbargs = args.slice();
      cb = _(args.slice().reverse()).find(function(arg) {
        return _.isFunction(arg);
      });
      if (cb != null) {
        args[args.indexOf(cb)] = function() {
          cbargs.push.apply(cbargs, arguments);
          callback.apply(delegate, cbargs);
          return cb.apply(target, arguments);
        };
      }
      return fn.apply(target, args);
    };
  };

  tapcbplain = function(target, fn, delegate, callback) {
    return function() {
      var args, cb;
      args = Array.prototype.slice.call(arguments);
      cb = _(args.slice().reverse()).find(function(arg) {
        return _.isFunction(arg);
      });
      if (cb != null) {
        args[args.indexOf(cb)] = function() {
          callback.apply(delegate, arguments);
          return cb.apply(target, arguments);
        };
      }
      return fn.apply(target, args);
    };
  };

  module.exports = {
    Class: tapclass,
    Object: tapobject,
    Function: tapfunction
  };

}).call(this);
