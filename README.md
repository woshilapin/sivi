Sivi
=====

Sivi is a web application to create curriculum vitae.  It's running Node JS for
the server side and uses JQuery and Bootstrap for the client side.

# Run the web application

On the server, you need NodeJS to be installed with `npm`.  Clone the
repository.

	$ git clone https://github.com/woshilapin/sivi.git

Then install some NodeJS modules like `httpserver` and `node-static`.

    $ cd sivi
    $ npm install

You should also run MongoDB.

    $ mongod --dbpath /path/to/your/data

Finally, you can run it.

    $ node start

