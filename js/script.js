let app = new Vue({
	el: '#app',
	data: {
		searchStr:	'',
		tempStr:	'',
		order:		'latest',
		curPage:	1,
		pagesMax:	5,
		timeout:	setTimeout( function() {}, 0 ),
	},
	methods: {
		submit() {
			this.searchStr = this.tempStr;
		},
		input() {
			clearTimeout( this.timeout );
			this.timeout = setTimeout( function() {
				app.searchStr = app.tempStr;
			}, 1000 );
		},
		beautifyDate(date) {
			let d 		= new Date(date),
				result	= '';

			result	+= pad(d.getHours())+':'+pad(d.getMinutes())+' ';
			result	+= pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+pad(d.getFullYear());

			return result;
		},
	},
	computed: {
		pages() {
			let arr 	= [this.curPage],
				where 	= 'first';

			while ( arr.length != this.pagesMax ) { // Пока количество страниц не сравняется с желаемым количеством..
				if ( where == 'last' ) { // если нужно добавить в конец
					arr.push( arr[ arr.length-1 ] + 1 ); // добавляю в массив число, на 1 больше последнего элемента массива
					where = 'first'; // меняю маркер, куда добавлять в следующий раз
				}
				else if ( where == 'first' ) { // если нужно добавить в начало
					if ( arr[0] > 1 ) // если сейчас первый элемент массива не является страницей №1, то..
						arr.unshift( arr[0] - 1 ); // добавляю в массив число, на 1 меньше самого первого элемента массива
					where = 'last'; // меняю маркер, куда добавлять в следующий раз
				}
			}

			return arr;
		},
		images() {
			let a 	= this.searchStr,
				b	= this.order,
				c	= this.curPage;
			return getImages( a, b, c );
		}
	},
});


function getImages( search, order, page ) {
	let key 		= '42076a992c25543229955ad67affed158a462011ab024691aff774fd2aceec52',
		per_page	= 6,
		link		= '',
		result		= [];

	if ( search == '' )
		link		= "https://api.unsplash.com/photos?&page="+page+"&per_page="+per_page+"&order_by="+order+"&client_id="+key;
	else
		link		= "https://api.unsplash.com/search/photos?&page="+page+"&per_page="+per_page+"&client_id="+key+"&query="+search;

	$.ajax({
		type:	"GET",
		url:	link,
		async:	false,
		success: function( data ) {
			console.log(data);
			if ( data.length > 0 || data.results.length > 0 ) {
				if ( search == '' ) {
					for (let i = 0; i < data.length; i++) {
						result.push({
							thumb:		data[i].urls.small,
							regular:	data[i].urls.regular,
							full:		data[i].urls.full,
							date:		data[i].updated_at,
							username:	data[i].user.name,
							color:		data[i].color,
						});
					}
				}
				else {
					for (let i = 0; i < data.results.length; i++) {
						result.push({
							thumb:		data.results[i].urls.small,
							regular:	data.results[i].urls.regular,
							full:		data.results[i].urls.full,
							date:		data.results[i].updated_at,
							username:	data.results[i].user.name,
							color:		data.results[i].color,
						});
					}
				}
			}
		}
	});

	return result;
}

function pad(n) {
    if (n < 10)
        return "0" + n;
    return n;
}