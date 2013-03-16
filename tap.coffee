_ = require 'underscore'

classwitharguments = (f, args) ->
  class WrappedClass extends f
    constructor: () ->
      WrappedClass.__super__.constructor.apply @, args

# Target is the class you wish to tap into
# Delegate is the class you are delegating to
# Either inherit the delegate from `tapinto.Class(target)`
# Or create new class by
#   class NewClass extends tapinto.Class(target, delegate)
tapclass = (target, delegate) ->
  class Tap
    constructor: () ->
      targetclass = classwitharguments target, arguments
      @target = new targetclass
      if delegate?
        delegateclass = classwitharguments delegate, arguments
        @delegate = new delegateclass
      else
        @delegate = @
      for name in _.functions @target
        fn = @target[name]
        options =
          delegate: @delegate
        if @delegate[name]?
          value = @delegate[name]
          if _.isFunction value
            options.fn = value
          else if _.isObject value
            options = _.extend options, value
            
        @[name] = tapfunction @target, fn, options

tapobject = (target, delegate) ->
  result = {}
  for name in _.functions target
    fn = target[name]
    options =
      delegate: delegate
    if delegate[name]?
      value = delegate[name]
      if _.isFunction value
        options.fn = value
      else if _.isObject value
        options = value
    result[name] = tapfunction target, fn, options
  result

tapfunction = (target, fn, options) ->
  result = fn
  
  if options.fn? and _.isFunction options.fn
    result = tapfn target, result, options.delegate, options.fn
  
  if options.cb? and _.isFunction options.cb
    result = tapcb target, result, options.delegate, options.cb
    
  result

tapfn = (target, targetfn, delegate, delegatefn) ->
  () ->
    result = delegatefn.apply delegate, arguments
    if result? and _.isFunction result
      tapped = tapcbplain target, targetfn, delegate, result
      tapped.apply delegate, arguments
      return
      
    targetfn.apply target, arguments

tapcb = (target, fn, delegate, callback) ->
  () ->
    args = Array::slice.call arguments
    cbargs = args.slice()
    cb = _(args.slice().reverse()).find (arg) -> _.isFunction arg
    if cb?
      args[args.indexOf cb] = () ->
        cbargs.push.apply cbargs, arguments
        callback.apply delegate, cbargs
        cb.apply target, arguments
        
    fn.apply target, args

tapcbplain = (target, fn, delegate, callback) ->
  () ->
    args = Array::slice.call arguments
    cb = _(args.slice().reverse()).find (arg) -> _.isFunction arg
    if cb?
      args[args.indexOf cb] = () ->
        callback.apply delegate, arguments
        cb.apply target, arguments
        
    fn.apply target, args


module.exports = 
  Class: tapclass
  Object: tapobject
  Function: tapfunction