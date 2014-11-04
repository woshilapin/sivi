Sivi
=====

Sivi is a web application to create curriculum vitae.  It's running Node JS for
the server side and uses JQuery and Bootstrap for the client side.

# Prerequisite

You need to install MongoDB, NodeJS and LaTeX.

    $ sudo apt-get install mongodb nodejs texlive texlive-latex-extra

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
