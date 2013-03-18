Tap into classes and methods
----------------------------

```coffeescript
dropbox = require 'dropbox'
tapinto = require 'tapinto'

class Client extends tapinto.Class(dropbox.Client)
    constructor: (@options) ->
        super
                
    readfile: (path, options, callback) ->
        console.log 'Intercepted a file read'
        (error, content, stat, range) ->
            console.log 'Intercepted the results of a file read'
    
    #readdir: (path, options, callback) ->
    #  (error, files, dirstat, filestats) ->
    #
    #stat: (path, options, callback) ->
    #  (error, stat, filestats) ->

module.exports =
    Client: Client
```


What is the problem?
--------------------

Occasionally the functionality of a library is not enough, there are a few more things you want it to do. You could jump in and fork the project, but often your additions are not in line with the project direction. A mechanism to wrap and tap into the implementation of a library is useful.

Aspect Oriented Programming for nodejs.


How tapinto solves this problem
-------------------------------

1. Tapinto provides three mechanisms to tap into other modules: class, object and function. Only methods will be intercepted in each of these scenarios.
2. To tap into a class inherit from `tapinto.Class(dropbox.Client)`. Methods with the same name on your class will be called first. Return a method to tap into a callback.
3. To tap into an object use the following: `tappedobject = tapinto.Object(targetobject, yourobject)`.
4. To tap into a function or method use the following: `tappedmethod = tapinto.Function(targetmethod, yourmethod)`
5. A note on callbacks: tapinto will find the last parameter that is a function and use that as the callback.


Goals
-----

1. Simple
2. Elegant syntax
3. Magic is okay