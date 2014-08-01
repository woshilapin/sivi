var fs = require('fs');
var path = require('path');
var nodestatic = require('node-static');
var querystring = require('querystring');
var exec = require('child_process').exec;

var servefile = module.exports.servefile = function(request, response, data) {
	var htmlfiles = new nodestatic.Server('./www/');
	htmlfiles.serve(request, response);
}

var submit = module.exports.submit = function(request, response, data) {
	if(request.method.toUpperCase() === 'POST') {
		var texfilepath = path.join(__dirname, 'resources/tex', 'cv.tex');
		var texrubricsfilepath = path.join(__dirname, 'resources/tex', 'rubrics.tex');
		var dvifilepath = path.join(__dirname, 'resources/tex', 'cv.dvi');
		var psfilepath = path.join(__dirname, 'resources/tex', 'cv.ps');
		var pdffilepath = path.join(__dirname, 'resources/pdf', 'cv.pdf');
		var texfile = fs.createWriteStream(texfilepath);
		var texrubricsfile = fs.createWriteStream(texrubricsfilepath);
		var pdffile = fs.createReadStream(pdffilepath);
		var pdffilestats = fs.statSync(pdffilepath);
		var form = querystring.parse(data);
		texfile.write('\\NeedsTeXFormat{LaTeX2e}\n');
		texfile.write('\\documentclass{curve}\n');
		texfile.write('\t\\usepackage[utf8]{inputenc}\n');
		texfile.write('\t\\usepackage[T1]{fontenc}\n');
		texfile.write('\t\\leftheader{Bla}\n');
		texfile.write('\t\\rightheader{Blo}\n');
		texfile.write('\t\\title{Ingénieur}\n');
		texfile.write('\t\\subtitle{docteur en informatique}\n');
		texfile.write('\\begin{document}\n');
		texfile.write('\t\\makeheaders\n');
		texfile.write('\t\\maketitle\n');
		texfile.write('\t\\makerubric{rubrics}\n');
		texfile.write('\\end{document}\n');
		texrubricsfile.write('\\begin{rubric}{Diplomes}\n');
		texrubricsfile.write('\\entry*[2012]Thèse en informatique\n');
		texrubricsfile.write('\\end{rubric}{Diplomes}\n');
		var ps2pdf = function(error, stdout, stderr) {
			console.log(error);
			console.log('Compiling PS file');
			exec('cd resources/tex; ps2pdf ' + psfilepath + ' ' + pdffilepath, function(error, stdout, stderr) {
				console.log(stdout);
				console.log(stderr);
				console.log(error);
				response.writeHead(200, {
						'Content-Type': 'application/pdf',
						'Content-Length': pdffilestats.size
				});
				pdffile.pipe(response);
			});
		};
		var dvi2ps = function(error, stdout, stderr) {
			console.log(error);
			console.log('Compiling DVI file');
			exec('cd resources/tex; dvips ' + dvifilepath, ps2pdf);
		};
		var latex2dvi = function() {
			console.log('Compiling LaTeX file');
			exec('cd resources/tex; latex ' + texfilepath, dvi2ps);
		};
		latex2dvi();
	}
}
