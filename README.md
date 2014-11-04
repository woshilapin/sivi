Sivi
=====

Sivi is a web application to create curriculum vitae.  It's running Node JS for
the server side and uses JQuery and Bootstrap for the client side.

# Prerequisite

You need to install MongoDB, NodeJS, NPM and LaTeX.

    $ sudo apt-get install mongodb nodejs npm texlive texlive-latex-extra

On Debian, only `nodejs` executable is provided but `node` is the standard.  You
may want to create a links.

    $ ln -s /usr/lib/nodejs /usr/lib/node

Then clone the repository

    $ git clone https://github.com/woshilapin/sivi.git

Some initialisation must be done.

    $ cd sivi/
	$ npm install
	$ ./node_modules/bower/bin/bower install

At this point, everything should be installed, you just need to run.

# Run the web application

You should run MongoDB.

    $ mongod --dbpath /path/to/your/data

Finally, you can run it.

    $ npm start

Your web application is now accessible on http://127.0.0.1:3000/.

# References

2 tutorials helps a lot in the creation of this application:
* http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/
* http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/
