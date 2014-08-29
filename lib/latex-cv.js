var fs = require('fs');
var path = require('path');
var process = require('child_process');
var moment = require('moment');

var texcmd = function(name, opts, args) {
	// If there is no optional arguments
	if(opts instanceof Array) {
		args = opts;
		opts = undefined;
	}
	var str = '\\' + name;
	if(opts !== undefined) {
		str += '[' + opts + ']';
	}
	if(args !== undefined) {
		for(index=0; index<args.length; index++) {
			str += '{' + args[index] + '}';
		}
	}
	return str;
};

var maintex = function(mainpath, cv, next) {
	var id = cv._id;
	var texfilename = id + '.tex';
	var texpath = path.join(mainpath, texfilename);
	var texfile = fs.createWriteStream(texpath);
	var content = '';
	content += texcmd('NeedsTeXFormat', ['LaTeX2e']) + '\n';
	content += texcmd('documentclass', ['curve']) + '\n';
	content += texcmd('usepackage', 'utf8', ['inputenc']) + '\n';
	content += texcmd('usepackage', 'T1', ['fontenc']) + '\n';
	var title = 'Computer Sciences Engineer';
	content += texcmd('title', [title]) + '\n';
	var author = cv.firstname + ' ' + cv.lastname;
	content += texcmd('author', [author]) + '\n';
	var leftheader = cv.firstname + ' ' + cv.lastname + '\\\\\n';
	leftheader += cv.address.street + '\\\\\n';
	leftheader += cv.address.postal + ' ' + cv.address.city + '\\\\\n';
	var birthday = moment(new Date(cv.birthday));
	leftheader += 'Born on ' + birthday.format('DD MMMM YYYY') + '\\\\\n';
	content += texcmd('leftheader', [leftheader]) + '\n';
	content += texcmd('rightheader', ['']) + '\n';
	content += texcmd('begin', ['document']) + '\n';
	content += texcmd('makeheaders') + '\n';
	content += texcmd('maketitle') + '\n';
	var diplomasid = id + '-diplomas';
	var diplomastexpath = texpath.replace(id, diplomasid);
	rubricstex(diplomastexpath, 'Diplomas', cv.diplomas);
	content += texcmd('makerubric', [diplomasid]) + '\n';
	var experiencesid = id + '-experiences';
	var experiencestexpath = texpath.replace(id, experiencesid);
	rubricstex(experiencestexpath, 'Experiences', cv.experiences);
	content += texcmd('makerubric', [experiencesid]) + '\n';
	content += texcmd('end', ['document']) + '\n';
	texfile.write(content);
	if(next instanceof Function) next(texpath);
};

var rubricstex = function(texpath, title, list) {
	var texfile = fs.createWriteStream(texpath);
	var content = '';
	content += texcmd('begin', ['rubric', title]) + '\n';
	for(index=0; index<list.length; index++) {
		var e = list[index];
		content += texcmd('entry*', e.year) + e.name + '\n';
	}
	content += texcmd('end', ['rubric']) + '\n';
	texfile.write(content);
};

var tex2dvi = function(texpath, next) {
	var dvipath = texpath.replace(/\.tex$/, '.dvi');
	var mainpath = path.dirname(texpath);
	var shcmd = 'cd ' + mainpath + ';';
	shcmd += 'latex -output-directory=' + mainpath + ' ' + texpath;
	process.exec(shcmd, function(error, stdout, stderr) {
		if(next instanceof Function) next(dvipath);
	});
};

var dvi2ps = function(dvipath, next) {
	var pspath = dvipath.replace(/\.dvi$/, '.ps');
	var mainpath = path.dirname(dvipath);
	var shcmd = 'cd ' + mainpath + ';';
	shcmd += 'dvips -o ' + pspath + ' ' + dvipath;
	process.exec(shcmd, function(error, stdout, stderr) {
		if(next instanceof Function) next(pspath);
	});
};

var ps2pdf = function(pspath, next) {
	var pdfpath = pspath.replace(/\.ps$/, '.pdf');
	var mainpath = path.dirname(pspath);
	var shcmd = 'cd ' + mainpath + ';';
	shcmd += 'ps2pdf ' + pspath + ' ' + pdfpath;
	process.exec(shcmd, function(error, stdout, stderr) {
		if(next instanceof Function) next(pdfpath);
	});
};

var compile = function(texpath, next) {
	tex2dvi(texpath, function(dvipath) {
		dvi2ps(dvipath, function(pspath) {
			ps2pdf(pspath, function(pdfpath) {
				if(next instanceof Function) next(pdfpath);
			});
		});
	});
};

var generate = module.exports.generate = function(cv, next) {
	var mainpath = path.join('/tmp', 'sivi');
	fs.mkdir(mainpath, function(err) {
		maintex(mainpath, cv, function(texpath) {
			compile(texpath, function(pdfpath) {
				if(next instanceof Function) next(pdfpath);
			});
		});
	});
};
