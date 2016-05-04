var express = require('express')     //加载express模块
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')        //extend方法
var Movie = require('./models/movie')

var bodyParser = require('body-parser')
var serveStatic = require('serve-static')

var port = process.env.PORT || 3000  //设置端口
var app = express()      //启动一个服务器

mongoose.connect('mongodb://127.0.0.1/imooc')

app.set('views','./views/pages')       	 //设置视图的根目录
app.set('view engine','jade')		     //加载jade引擎
 
app.use(bodyParser.urlencoded({extended:true}))
//app.use(bodyParser(json()))
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port) 				     //监听端口

console.log('program started on port' + port)

//index page
app.get('/',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		
//	console.log(typeof(movies));  //obj
//	console.log(JSON.stringify(movies));
    var arr = [];
    for(var item in movies)
    {
    	arr[item] = movies[item];
    }
    var arr2 = arr.sort(Movie.randomSort)  //随机
//  console.log(arr2);
//  console.log(arr);
//  console.log(movies[item]._id);  //打印所有ID
    
    
	res.render('index',{
		title:'首页',
		movies:arr2
	})
})

//detail page
app.get('/movie/:id',function(req, res){
	var id = req.params.id
	Movie.findById(id, function(err, movie){
//	console.log(movie);
	res.render('detail',{
		title:movie.title + '详情页',
		movie:movie
	})
	})
})

//admin page
app.get('/admin/movie',function(req, res){
	res.render('admin',{
		title:'后台管理',
		movie:{
			title: '',
			doctor: '',
			country: '',
			year: '',
			poster: '',
			flash:'',
			summary:'',
			language: ''
		}
	})
})

//admin update movie
app.get('/admin/update/:id', function(req, res){
	var id = req.params.id

	if (id) {
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: '后台更新页',
				movie: movie
			})
		})
	}
})

//admin post movie  拿到从后台post过来的数据
app.post('/admin/movie/new', function(req, res){
	var id = req.body.movie._id  
	var movieObj = req.body.movie
	var _movie

	if (id !== 'undefined') {       //数据库中已有
		Movie.findById(id, function(err, movie){   //查到
			if (err) {
				console.log(err)
			};
			_movie = _.extend(movie, movieObj)    //新的字段替换老的字段
			_movie.save(function(err, movie){
				if (err) {
					console.log(err)
				};
				res.redirect('/movie/'+ movie._id)
			})
		})
	}else{
		_movie = new Movie({            //如果评委不是新加的，传入构造函数
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})
		_movie.save(function(err, movie){
			if (err) {
				console.log(err);
			};
			res.redirect('/movie/'+ movie._id);
		})
	}
})

//list page
app.get('/admin/list',function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
		title:'列表页',
		movies: movies
	    })
	})
	})
})

//list delete movie   删除接收的路由
app.delete('/admin/list', function(req, res){
	var id = req.query.id
//	console.log(id)
	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success: 1})
			}
		})
	}
});




