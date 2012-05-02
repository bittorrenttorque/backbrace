#Simulo
- [http://github.com/gmoeck/simulo](http://github.com/gmoeck/simulo)


##Description:
Simulo is designed to make it easier to test your sproutcore
applications in pure javascript by providing a way to easily simulate
common events from the browser without having to use the Sproutcore
event objects directly. 

##Installation

To setup fictum to work in your SproutCore project, we need to add the framework to your application.

    $ cd <your sproutcore project's root directory>
    $ mkdir frameworks # if you don't already have a frameworks folder
    $ cd frameworks
    $ git clone git://github.com/gmoeck/simulo.git

Once Simulo has been downloaded into your frameworks directory, you then need to update your project's Buildfile file. This can be done like so:

    config :all, :required => [:sproutcore, :simulo]


##Running Simulo's Unit Tests
First you need to update your Buildfile to include sproutcore-jasmine.
**Note**: When you go back to production, you need to recomment out
these lines.

Then start your server running.

    $ cd <your sproutcore project's root directory>
    $ sc-server

###Unit Tests
    http://localhost:4020/static/foundation/en/current/tests/unit.html

##License:
(The MIT License)

Copyright © 2011 Gregory Moeck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

