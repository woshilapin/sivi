var express = require('express');
var path = require('path');
var mongo = require('mongoskin');
var latex = require(path.join(__dirname, '../lib', 'latex-cv.js'));
var router = express.Router();

router.get('/', function(req, res) {
	var db = req.db;
	db.collection('cv').find().toArray(function(err, items) {
		if(err === null) {
			res.status(200).json(items);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.get('/:email', function(req, res) {
	var db = req.db;
	var query = {
		$query: {
			email: req.params.email
		}
	};
	db.collection('cv').find(query).toArray(function(err, items) {
		if(err === null) {
			res.status(200).json(items);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.post('/:email', function(req, res) {
	var db = req.db;
	req.body._date = new Date();
	db.collection('cv').insert(req.body, function(err, result) {
		if(err === null) {
			var message = {msg: ""};
			res.status(201).send(message);
		} else {
			var message = {msg: err};
			res.status(403).send(message);
		}
	});
});

router.delete('/:email', function(req, res) {
	var db = req.db;
	var query = {
		email: req.params.email
	};
	db.collection('cv').remove(query, function(err, result) {
		if(result === 1) {
			var message = {msg: ""};
			res.status(204).send(message);
		} else {
			var message = {msg: err};
			res.status(403).send(message);
		}
	});
});

// Must be before the route [/:email/:id]
router.get('/:email/pdf', function(req, res) {
	var db = req.db;
	var query = {
		$query: {
			email: req.params.email
		},
		$orderby: {
			_date: -1
		}
	};
	db.collection('cv').findOne(query, function(err, result) {
		var pdfpath = latex.generate(result, function(pdfpath) {
			if(pdfpath !== undefined) {
				res.status(201).set('Content-Type', 'application/pdf').sendFile(pdfpath);
			}
		});
	});
});

// Must be before the route [/:email/:id]
router.get('/:email/last', function(req, res) {
	var db = req.db;
	var query = {
		$query: {
			email: req.params.email
		},
		$orderby: {
			_date: -1
		}
	};
	db.collection('cv').findOne(query, function(err, result) {
		if(err === null && result != null) {
			res.status(200).json(result);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.get('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		$query: {
			_id: mongo.helper.toObjectID(req.params.id),
			email: req.params.email
		}
	};
	db.collection('cv').findOne(query, function(err, result) {
		if(err === null) {
			res.status(200).json(result);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.put('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		_id: mongo.helper.toObjectID(req.params.id),
		email: req.params.email
	};
	req.body._date = new Date();
	db.collection('cv').update(query, req.body, function(err, result) {
		if(err === null) {
			var message = {msg: ""};
			res.status(204).send(message);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

router.delete('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		_id: mongo.helper.toObjectID(req.params.id),
		email: req.params.email
	};
	db.collection('cv').remove(query, function(err, result) {
		if(result === 1) {
			var message = {msg: ""};
			res.status(204).send(message);
		} else {
			var message = {msg: err};
			res.status(404).send(message);
		}
	});
});

module.exports = router;
