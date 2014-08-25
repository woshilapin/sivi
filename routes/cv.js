var express = require('express');
var mongo = require('mongoskin');
var router = express.Router();

router.get('/', function(req, res) {
	var db = req.db;
	db.collection('cv').find().toArray(function(err, items) {
		if(err === null) {
			res.status(200).json(items);
		} else {
			res.status(404).send({"msg": err});
		}
	});
});

router.get('/:email', function(req, res) {
	var db = req.db;
	var query = {
		"email": req.params.email
	};
	db.collection('cv').find({"$query": query}).toArray(function(err, items) {
		if(err === null) {
			res.status(200).json(items);
		} else {
			res.status(404).send({"msg": err});
		}
	});
});

router.post('/:email', function(req, res) {
	var db = req.db;
	req.body._date = new Date();
	db.collection('cv').insert(req.body, function(err, result) {
		if(err === null) {
			res.status(201).send({"msg": ""});
		} else {
			res.status(403).send({"msg": err});
		}
	});
});

router.delete('/:email', function(req, res) {
	var db = req.db;
	var query = {
		"email": req.params.email
	};
	db.collection('cv').remove(query, function(err, result) {
		if(result === 1) {
			res.status(204).send({"msg": ""});
		} else {
			res.status(404).send({"msg": err});
		}
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
		if(err === null && result != null) {
			res.status(200).json(result);
		} else {
			res.status(404).send({"msg": err});
		}
	});
});

router.get('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		"_id": mongo.helper.toObjectID(req.params.id),
		"email": req.params.email
	};
	db.collection('cv').findOne({"$query": query}, function(err, result) {
		if(err === null) {
			res.status(200).json(result);
		} else {
			res.status(404).send({"msg": err});
		}
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
		if(err === null) {
			res.status(204).send({"msg": ""});
		} else {
			res.status(403).send({"msg": err});
		}
	});
});

router.delete('/:email/:id', function(req, res) {
	var db = req.db;
	var query = {
		"_id": mongo.helper.toObjectID(req.params.id),
		"email": req.params.email
	};
	db.collection('cv').remove(query, function(err, result) {
		if(result === 1) {
			res.status(204).send({"msg": ""});
		} else {
			res.status(404).send({"msg": err});
		}
	});
});

module.exports = router;
