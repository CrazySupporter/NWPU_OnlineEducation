// 一个没有监听端口的 Express 实例
require('../test-debug.js');

const {app, server} = require('../../app');
// Express 实例传入 supertest，使其运行实例
const request = require('supertest-session')(app);
const should = require('should');
const assert = require('assert');
const randomString = require('../../utils/funcs').randomString;
const getConnection = require('../../utils/funcs.js').getConnection;
const doSqlQuery = require('../../utils/funcs.js').doSqlQuery;
let mysql_config = require('../../configures/database.config.js');

var log4js = require("log4js");
var log4js_config = require("../../configures/log.config.js").unittest_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('default');

describe('# Testing /api/class', function () {
	this.timeout(8000);
	let test_user = {
		nickname: 'i_am_a_teacher',
		realname: 'TESTER',
		email: '123456@mail.com',
		role: 1,
		motto: 'just for test',
		password: '111111',
		phone: '13688880000'
	};
	let test_class = {
		title: "unit_test_class",
		type: 1,
		resources: ["details", "participants", "settings", "file_settings", "train_area", "train_area_teacher", "posts"],
		notice: "FtJxcAhrRp7rkfmp",
		description: "ifQxW2EQzbAMm7Je",
	};
	before(function () {
		mysql_config.database = 'ac_test';
	});
	let class_id = null;
	let select_prob_code = null;
	let program_prob_code = null;
	describe('#Teacher`s action.', function () {
		before(function (done) {
			request.
				post('/api/user/register').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
		});
		it("Create the class.", function (done) {
			request.
				post('/api/class/create').
				send(test_class).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err)
						done(err);
					else if (res.body.status !== 'SUCCESS.')
						done('STATUS FAILED.' + JSON.stringify(res, null, 3));
					else
						done();
					class_id = res.body.id;
				});
		});
		it("Make sure that the id is returned.", function () {
			assert(class_id !== undefined);
		});
		it("Check if resources works.",function (done) {
			request.
				post('/api/class/resources/query').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						assert(res.body.resources.length === 7);
						done();
					}
				});
		});
		it("Check if the `status` works.", function (done) {
			request.
				post('/api/class/status').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						assert(res.body.results.role === 0);
						done();
					}
				});
		});
		it("Check the infomation.", function (done) {
			request.
				post('/api/class/info/query').
				send({ class_id: class_id, page_size: 20 }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						for (let key in test_class) {
							if (key === 'resources') continue;
							res.body.info.should.have.value(key, test_class[key]);
						}
						res.body.should.have.value('resources', test_class.resources);
						done();
					}
				});
		});
		it("Can be fetched from public courses.", function (done) {
			request.
				post('/api/class/public/fetch').
				send({ page_number: 1, page_size: 20 }).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else {
						res.body = JSON.parse(res.text);
						res.body.results[0].title.should.be.equal(test_class.title);
						done();
					}
				});
		});
		it("Can be fetch from my course.", function (done) {
			request.
				post('/api/class/my_course/fetch').
				send({ page_number: 1, page_size: 20 }).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else {
						res.body = JSON.parse(res.text);
						assert(res.body.results.length !== 0);
						done();
					}
				});
		});
		it("Can show participants.", function (done) {
			request.
				post('/api/class/participants/show').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else {
						res.body = JSON.parse(res.text);
						assert(res.body.results.length !== 0);
						done();
					}
				});
		});
		it("Can add a selection problem into my course.", function (done) {
			request.
				post('/api/problem/create').
				send({ class_id: class_id, type: 0 }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else done();
				});
		});
		it("Can add a program problem into my course.", function (done) {
			request.
				post('/api/problem/create').
				send({ class_id: class_id, type: 1 }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else done();
				});
		});
		it("Can set the cache.", function(done) {
			request.
				post('/api/class/cache/set').
				send({class_id: class_id, entry:'test', data:'test_data'}).
				expect(200).
				end(function (err, res) {
					if (err)done(err);
					else done();
				});
		});
		it("Can get the cache.", function(done) {
			request.
				post('/api/class/cache/get').
				send({class_id: class_id, entry:'test'}).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err)done(err);
					else {
						assert(res.body.results[0].data === 'test_data');
						done();
					}
				});
		});
		it("Can update the cache.", function(done) {
			request.
				post('/api/class/cache/set').
				send({class_id: class_id, entry:'test', data:'test_data_updated'}).
				expect(200).
				end(function (err, res) {
					if (err)done(err);
					else done();
				});
		});
		it("Can get the updated cache.", function(done) {
			request.
				post('/api/class/cache/get').
				send({class_id: class_id, entry:'test'}).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err)done(err);
					else {
						assert(res.body.results[0].data === 'test_data_updated');
						done();
					}
				});
		});
		it("Check the practice area.", function (done) {
			request.
				post('/api/problem/list').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					assert(res.body.results.length === 0);
					done();
				});
		});
		it("Check the problem list.", function (done) {
			request.
				post('/api/problem/list').
				send({ class_id: class_id, type:'teacher' }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						select_prob_code = res.body.results[0].code;
						program_prob_code = res.body.results[0].code;
						assert(select_prob_code !== undefined);
						assert(select_prob_code !== null);
						assert(program_prob_code !== undefined);
						assert(program_prob_code !== null);
						done();
					}
				});
		});
		it("Publish the choice problem.", function(done) {
			request.  
				post('/api/problem/state/set').
				send({code: select_prob_code, state:1}).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else done();
				});
		});
		it("Publish the program problem.", function(done) {
			request.  
				post('/api/problem/state/set').
				send({code: select_prob_code, state:1}).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else done();
				});
		});
		/*
		it("Can edit class info.", function(done) {
			request.  
				post('/api/class/info/update').
				send({}).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else done();
				});
		});
		*/
		after(function (done) {
			request.
				get('/api/user/logout').
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else done();
				});
		});
	});
	describe("#Student's action.", function () {
		let test_user_stu = {
			nickname: 'i_am_a_student',
			realname: '_TESTER',
			email: '_123456@mail.com',
			role: 2,
			motto: 'just for test',
			password: '111111',
			phone: '13688880001'
		};
		before(function (done) {
			request.
				post('/api/user/register').
				send(test_user_stu).
				expect(200).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
		});
		it('Try to create class.', function (done) {
			request.
				post('/api/class/create').
				send(test_class).
				expect(403).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
		});
		it('Try to join class.', function (done) {
			request.
				post('/api/class/join').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else {
						done();
					}
				});
		});
		it("Try to exit class.", function (done) {
			request.
				post('/api/class/participants/delete').
				send({ class_id: class_id, user_id: null }).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else {
						done();
					}
				});
		});
		it("Try to verify the user do quit.", function (done) {
			request.
				post('/api/class/status').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						res.body.details.should.be.equal('NOT_IN_CLASS.');
						done();
					}
				});
		});
		it('Try to join class, again.', function (done) {
			request.
				post('/api/class/join').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else {
						done();
					}
				});
		});
		it("Check the selection problem list.", function (done) {
			request.
				post('/api/problem/list').
				send({ class_id: class_id }).
				expect(200).
				end(function (err, res) {
					res.body = JSON.parse(res.text);
					if (err) done(err);
					else {
						select_prob_code = res.body.results[0].code;
						assert(select_prob_code !== undefined);
						assert(select_prob_code !== null);
						done();
					}
				});
		});
		it("Try to submit a answer.", function (done) {
			request.
				post('/api/problem/choice_problem/submit').
				send({ code: select_prob_code, answer: 'A' }).
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else {
						done();
					}
				});

		});
		after(function (done) {
			request.
				get('/api/user/logout').
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else done();
				});
		});
	});
	describe('# API cover', function() {
		before(function (done) {
			request.
				post('/api/user/login').
				send(test_user).
				expect(200).
				end(function (err, res) {
					if (err)
						done(err);
					else
						done();
				});
		});
		let apis = [
			{
				url: "/api/class/participants/show_blacklisting",
				params: { class_id: null },
			},
			{
				url: "/api/class/participants/white",
				params: { class_id: null, user_id: 1 },
			},
			{
				url: '/api/class/invite/check',
				params: { invitation_code: 'NO_SUCH_CODE'},
				exp_no: 403,
			},
			{
				url: '/api/problem/get',
				params: { problem_id: null},
			},
			{
				url: '/api/problem/save',
				params: { problem_id: null, title: 'haha'},
			},
			{
				url: '/api/problem/table/choice_problems/get',
				params: { problem_id: null},
			},
			{
				url: '/api/problem/table/program_problems/get',
				params: { problem_id: null},
			},
			{
				url: '/api/problem/choice_problem/gather',
				params: { problem_code: null},
			},
			{
				url: '/api/problem/program_problem/gather',
				params: { problem_code: null},
			},
			{
				url: '/api/problem/choice_problem/fetch',
				params: { problem_code: null},
			},
			{
				url: '/api/problem/program_problem/fetch',
				params: { problem_code: null, code: null},
			},
			{
				url: '/api/problem/choice_problem/submit',
				params: { problem_code: null},
			},
			{
				url: '/api/problem/program_problem/submit',
				params: { problem_code: null, code: null},
			},
			{
				url: '/api/class/participants/assignTA',
				params: { class_id:class_id, user_id:1},
			},
			{
				url: '/api/class/participants/cancelTA',
				params: { class_id:class_id, user_id:1},
			},
		];
		for (let idx in apis) {
			if (apis[idx].exp_no === undefined)
				apis[idx].exp_no = 200;
			let {url,params,exp_no} = apis[idx];
			it(url + '...', function (done) {
				if (params.class_id === null)
					params.class_id = class_id;
				if (params.problem_id === null)
					params.problem_id = select_prob_code;
				if (params.problem_code === null)
					params.problem_code = select_prob_code;
				if (params.code === null)
					params.code = select_prob_code;
				logger.warn(url, params);
				request.
					post(url).
					send(params).
					expect(exp_no).
					end(function (err, res) {
						if (err) {
							done(err);
							console.log(res,err);
						}
						else done();
					});
			});
		}
		after(function (done) {
			request.
				get('/api/user/logout').
				expect(200).
				end(function (err, res) {
					if (err) done(err);
					else done();
				});
		});
	});
	after(function (done) {
		getConnection().
			then(function (conn) {
				let sql = 'DELETE FROM classes';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'DELETE FROM problems';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'DELETE FROM classusers';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				let sql = 'DELETE FROM users';
				return doSqlQuery(conn, sql);
			}).
			then(function (packed) {
				let { conn, sql_res } = packed;
				done();
			}).
			catch(function (sql_res) {
				done(JSON.stringify(sql_res, null, 3));
			});
	});
});
