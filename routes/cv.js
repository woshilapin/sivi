var express = require('express');
var mongo = require('mongoskin');
var router = express.Router();

router.get('/', function(req, res) {
	var db = req.db;
	db.collection('cv').find().toArray(function(err, items) {
		res.json(items);
	});
});

router.get('/:email', function(req, res) {
	var db = req.db;
	var query = {
		"email": req.params.email
	};
	db.collection('cv').find({"$query": query}).toArray(function(err, items) {
		res.json(items);
	});
});

router.post('/:email', function(req, res) {
	var db = req.db;
	req.body._date = new Date();
	db.collection('cv').insert(req.body, function(err, result) {
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

router.delete('/:email', function(req, res) {
	var db = req.db;
	var query = {
		"email": req.params.email
	};
	db.collection('cv').remove(query, function(err, result) {
		res.send(
			(result === 1) ? { msg: '' } : { msg: err }
		);
	});
});

// Must be before the route [/:email/:id]
router.get('/:email/last', function(req, res) {
	var db = req.db;
	var query = {
		"email": req.params.email
	};
	var orderby = {"_date": -1};
	db.collection('cv').findOne({"$query": query, "$orderby": orderby}, function(err, result) {
		res.json(result);
	});
});

router.get('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		"_id": mongo.helper.toObjectID(req.params.id),
		"email": req.params.email
	};
	db.collection('cv').findOne({"$query": query}, function(err, result) {
		res.json(result);
	});
});

router.put('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		"_id": mongo.helper.toObjectID(req.params.id),
		"email": req.params.email
	};
	req.body._date = new Date();
	db.collection('cv').update(query, req.body, function(err, result) {
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

router.delete('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		"_id": mongo.helper.toObjectID(req.params.id),
		"email": req.params.email
	};
	db.collection('cv').remove(query, function(err, result) {
		res.send(
			(result === 1) ? { msg: '' } : { msg:'error: ' + err }
		);
	});
});

module.exports = router;
