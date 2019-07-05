var mysql = require('mysql');
var mysql_config = require('../configures/database.config.js');
var async = require('async');

var log4js = require("log4js");
var log4js_config = require("../configures/log.config.js").database_configure;
log4js.configure(log4js_config);
var logger = log4js.getLogger('database');



var sqls = {
	'create_class_cache_table': "CREATE TABLE IF NOT EXISTS `class_caches` ("+
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`class_id` INT UNSIGNED NOT NULL, " +
		"`entry` CHAR(30) NOT NULL, " +
		"`data` VARCHAR(1000), " +
		"`create_time` TIMESTAMP NULL, " +	
		"`drop_time` TIMESTAMP NULL, " +	
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",
	'create_program_problem_answer_table': "CREATE TABLE IF NOT EXISTS `program_problem_answers` (" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`code` CHAR(20) NOT NULL, " +
		"`problem_code` CHAR(20) NOT NULL, " +
		"`user_id` INT UNSIGNED NOT NULL, " +
		"`type` INT UNSIGNED, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",
	'create_program_problem_table' : "CREATE TABLE IF NOT EXISTS `program_problems` (" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`code` CHAR(20) NOT NULL, " +
		"`language` CHAR(20) NULL, " +
		"`description` CHAR(20) NOT NULL, " +
		"`answer_program_id` CHAR(20) NOT NULL, " +
		"`solution` CHAR(20) NOT NULL, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",
	'create_choice_problem_answer_table' : "CREATE TABLE IF NOT EXISTS `choice_problem_answers` (" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`user_id` INT UNSIGNED NOT NULL, " +
		"`code` CHAR(20), " +
		"`answer` CHAR(2), " +
		"`time` TIMESTAMP, " +
		"`type` INT UNSIGNED, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",
	'create_choice_problem_table' : "CREATE TABLE IF NOT EXISTS `choice_problems` (" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`code` CHAR(20) NOT NULL, " +
		"`description` char(25) NOT NULL, " +
		"`choice_count` INT NOT NULL DEFAULT 4, " +
		"`choice_A` VARCHAR(400), " +
		"`choice_B` VARCHAR(400), " +
		"`choice_C` VARCHAR(400), " +
		"`choice_D` VARCHAR(400), " +
		"`choice_E` VARCHAR(400), " +
		"`answer` CHAR(2), " +
		"`solution` CHAR(25) NOT NULL, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_problem_table' : "CREATE TABLE IF NOT EXISTS `problems` (" +
		"`code` CHAR(20) NOT NULL, " +
		"`title` VARCHAR(100) NOT NULL, " +
		"`class_id` INT UNSIGNED NOT NULL, " +
		"`type` INT UNSIGNED NOT NULL, " +
		"`creater` INT UNSIGNED NOT NULL, " +
		"`time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " +	// 发消息的日期时间，由数据库自动填充
		"`state` INT UNSIGNED NOT NULL, " +
		"PRIMARY KEY (`code`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_content_table' : "CREATE TABLE IF NOT EXISTS `contents` (" + //渲染富文本页面
		"`code` CHAR(25) NOT NULL, " +
		"`content` VARCHAR(10000) NOT NULL, " +
		"`deltas` VARCHAR(10000) NOT NULL, " +
		"PRIMARY KEY (`code`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;" ,

	'create_class_file_table' : "CREATE TABLE IF NOT EXISTS `coursefiles`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`class_id` INT UNSIGNED NOT NULL, " +
		"`file_id` INT UNSIGNED NOT NULL, " +
		"`filename` VARCHAR(100) NOT NULL, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_file_table': "CREATE TABLE IF NOT EXISTS `files`(" + //文件表
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`user_id` INT UNSIGNED NOT NULL, " +
		"`filename` VARCHAR(100), " +
		"`type` CHAR(20), " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_class_resources': "CREATE TABLE IF NOT EXISTS `resources`(" + //班级教学资源表
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`class_id` INT UNSIGNED NOT NULL, " +
		"`resource` CHAR(20), " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_class_table': "CREATE TABLE IF NOT EXISTS `classes`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " + //用于唯一标识一个班级
		"`imagepath` VARCHAR(500), " +
		"`description` VARCHAR(500), " +
		"`notice` VARCHAR(500), " + //班级公告
		"`title` VARCHAR(80) NOT NULL, " + //班级名
		"`type` INT UNSIGNED, " + //公开度
		"`registration_date` TIMESTAMP, " + //注册日期
		"`invitation_code` CHAR(40), " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_class_user_table': "CREATE TABLE IF NOT EXISTS `classusers`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`class_id` VARCHAR(40) NOT NULL, " + //班级id
		"`role` INT UNSIGNED NOT NULL, " + //2表示学生，1表示助教，0表示老师
		"`user_id` INT UNSIGNED NOT NULL," + //教室id
		"`registration_date` TIMESTAMP, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_user_table': "CREATE TABLE IF NOT EXISTS `users`(" + //用户表
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`email` CHAR(30)," +
		"`nickname` VARCHAR(40), " +
		"`realname` VARCHAR(40), " +
		"`role` INT UNSIGNED NOT NULL, " +//0管理员,1教师，2学生
		"`motto` VARCHAR(200), " +
		"`registration_date` TIMESTAMP, " +
		"`password` CHAR(40) NOT NULL, " +
		"`phone` CHAR(11) NOT NULL, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_banned_list': "CREATE TABLE IF NOT EXISTS `bannedlist`(" + //禁言列表，关联房间和使用者
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +
		"`userid` INT UNSIGNED NOT NULL, " +
		"`classid` INT UNSIGNED NOT NULL, " +
		"`status` INT UNSIGNED NOT NULL, " + //0代表禁言状态，1代表解除状态
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_forums': "CREATE TABLE IF NOT EXISTS `forums`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " + //消息id
		"`userid` INT UNSIGNED NOT NULL, " + //发言者id
		"`classid` INT UNSIGNED NOT NULL, " + //讨论区位置id
		"`message` VARCHAR(200), " + //发言内容
		"`registration_date` TIMESTAMP, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_posts': "CREATE TABLE IF NOT EXISTS `posts`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " + //消息id
		"`userid` INT UNSIGNED NOT NULL, " + //发言者id
		"`forumid` INT UNSIGNED NOT NULL, " + //属于哪个主题贴
		"`message` VARCHAR(200), " + //发言内容
		"`registration_date` TIMESTAMP, " +
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_lives': "CREATE TABLE IF NOT EXISTS `lives`(" +
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " + //直播条目id
		"`class` INT UNSIGNED NOT NULL, " + // 课程编号
		"`liveplayer_uid` VARCHAR(50), " + // 其对应的直播uid
		"`liveplayer_vid` VARCHAR(50), " + // 其对应的直播vid
		"`password` VARCHAR(50), " + // 其对应的密码
		"PRIMARY KEY (`id`) " +
		")ENGINE=InnoDB DEFAULT CHARSET=utf8;",

	'create_chat_record': "CREATE TABLE IF NOT EXISTS `chat_record` (" +	// 聊天记录表
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +	// 聊天记录id
		"`date_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +	// 发消息的日期时间，由数据库自动填充
		"`course_id` VARCHAR(40) NOT NULL, " +			// 课程id
		"`user_id` INT NOT NULL, " +			// 用户id
		"`course_status` INT NOT NULL, " +		// 用户在课程中的角色
		"`realname` VARCHAR(40), " +			// 用户姓名
		"`type` VARCHAR(40) NOT NULL, " + 		// 消息类型 ['text', 'picture', 'voice']
		"`message` VARCHAR(200) NOT NULL, " +	// 所发的消息，要求不能为空消息
		"`path` VARCHAR(100), " +				// 'picture' 和 'voice' 消息特有的属性，表示文件在云端的路径
		"PRIMARY KEY (`id`) " +
		") ENGINE = InnoDB DEFAULT CHARSET = utf8;",

	'create_blacklisting': "CREATE TABLE IF NOT EXISTS `blacklisting` (" +	// 课程黑名单
		"`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, " +	// id
		"`date_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, " +	// 日期时间，由数据库自动填充
		"`class_id` INT NOT NULL, " +			// 课程id
		"`user_id` INT NOT NULL, " +			// 用户id
		"`realname` VARCHAR(40), " +			// 用户姓名
		"PRIMARY KEY (`id`) " +
		") ENGINE = InnoDB DEFAULT CHARSET = utf8;",

	'create_database': 'CREATE DATABASE ' + mysql_config.database,
	'use_database': 'USE ' + mysql_config.database,
};

function mysql_initializer(db_cfg) { //倘若数据库不存在，则重新新建数据库
	return new Promise(function (resolve, reject) {
		let cfg = {
			host: mysql_config.host,
			user: mysql_config.user,
			password: mysql_config.password
		};
		sqls['create_database'] = 'CREATE DATABASE ' + mysql_config.database;
		sqls['use_database'] = 'USE ' + mysql_config.database;
		logger.debug(cfg);
		let conn = mysql.createConnection(cfg);
		conn.connect(function (err) {
			if (err) {
				reject({
					status: 'FAILED.',
					details: err
				});
				return;
			}
			var tasks = [
				'use_database',
				'create_user_table',
				'create_class_table',
				'create_class_user_table',
				'create_class_resources',
				'create_forums',
				'create_file_table',
				'create_banned_list',
				'create_content_table',
				'create_problem_table',
				'create_choice_problem_table',
				'create_choice_problem_answer_table',
				'create_program_problem_table',
				'create_program_problem_answer_table',
				'create_class_file_table',
				'create_posts',
				'create_lives',
				'create_chat_record',
				'create_class_cache_table',
				'create_blacklisting',
			];
			if (db_cfg.no_create !== true) {
				tasks = ['create_database'].concat(tasks);
			}
			async.eachSeries(tasks, function (item, next) {
				logger.warn(item + " ==> " + sqls[item]);
				conn.query(sqls[item], function (err, res) {
					if (err) {
						next({
							status: 'FAILED.',
							details: err
						}, null);
						return;
					}
					next(null, res);
				});
			}, function (err, res) {
				if (err)
					reject(err);
				else
					resolve(conn);
			});
		});
	});
}

module.exports = mysql_initializer;
