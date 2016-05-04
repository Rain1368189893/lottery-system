var mongoose = require('mongoose')

var MovieSchema = new mongoose.Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	meta: {               //录入或更新时对时间的记录
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
MovieSchema.pre('save', function(next){
	if (this.isNew) {     //判断数据是否是新加的
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next()
})

MovieSchema.statics = {
	fetch: function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById: function(id, cb){   //查询单条数据
		return this
		.findOne({_id: id})
		.exec(cb)
	},
	randomSort: function(a, b){
		return Math.random() > .5 ? -1 : 1;   //用Math.random()函数生成[0,1)之间的随机数与0.5比较，返回-1或1  
	}
}

module.exports = MovieSchema