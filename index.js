// firebase configuration

const firebaseConfig = {
	apiKey: "AIzaSyCXiykSv08W9sPt4gh88mcN7NZKnid9ysM",
  authDomain: "dismissal-bis.firebaseapp.com",
  databaseURL: "https://dismissal-bis-default-rtdb.firebaseio.com",
  projectId: "dismissal-bis",
  storageBucket: "dismissal-bis.appspot.com",
  messagingSenderId: "192785460392",
  appId: "1:192785460392:web:bc9b36b03f97c34faf269d"
}
firebase.initializeApp(firebaseConfig)
const db = firebase.database()

// end firebase configuration

//navigation

const reload = () => document.location.reload()

function show_page(id) {
	var html_collection = document.getElementsByClassName('page')
	var pages = Array.prototype.slice.call(html_collection)

	pages.forEach(i => i.classList.add('hidden'))

	document.getElementById(id).classList.remove('hidden')

	if (id == 'page-home') document.getElementById('title-text').innerText = 'Dismissal'
	
}

//end navigation

//global variables

var students = []
var _date
var _carline = []
var bus_letters = []
var home
var local

//end global variables

//home page buttons

var input_date = document.getElementById('carline-date')

async function set_today() {
	var year = new Date().getFullYear()
	var month = new Date().getMonth() + 1
	month < 10 ? (month = '0' + month.toString()) : null
	var day = new Date().getDate()
	day < 10 ? (day = '0' + day.toString()) : null
	_date = year + '-' + month + '-' + day
}

async function open_carline() {
	await set_today()
	input_date.value = _date

	db.ref('students')
		.once('value')
		.then(snap => {
			students = snap.val()

			// CATCH BUS LETTERS
			var all_buses = []
			var look_for_bus = i => {
				if (i.bus[0] != '0') {
					i.bus.forEach(item => all_buses.push(item))
				}
			}
			students.forEach(look_for_bus)

			var collect_bus_letters = i => {
				if (!bus_letters.includes(i)) bus_letters.push(i)
			}

			all_buses.forEach(collect_bus_letters)

			document.getElementById('bus-letters').innerHTML = ''

			bus_letters.forEach(letter => {
				var _div = `<div class="num" onclick="call_bus('${letter}')">${letter}</div>`
				document.getElementById('bus-letters').innerHTML += _div
			})
		})
		.catch(err => alert(err.message))
	
	show_page('page-carline')
}


var btn_carline = document.getElementById('btn-carline')
btn_carline.addEventListener('click', () => {
	local = 'carline'
	document.getElementById('title-text').innerText += ' ' + local
	open_carline()
})
var btn_front_office = document.getElementById('btn-front-office')
btn_front_office.addEventListener('click', () => {
	local = 'front-office'
	document.getElementById('title-text').innerText += ' ' + local
	open_carline()
})

var btn_classes = document.getElementById('btn-classes')
btn_classes.addEventListener('click', async e => {
	await set_today()
	document.getElementById('title-text').innerText = _date
	show_page('page-classes')
})


var btn_admin = document.getElementById('btn-admin')
btn_admin.addEventListener('click', e => {
	document.getElementById('title-text').innerText = 'Admin Page'
	show_page('page-admin')
	home = false
})

//end home page buttons

// carline

function select_date() {
	_date = input_date.value

	if (!_date == '') {
		check_if_exists()
			.then(carline => {
				document.getElementById('screen').innerHTML = ''
				document.getElementById('car-line-list').innerHTML = ''
				carline.reverse().map(update_carline)
				document.getElementById('title-text').innerText = _date + ' ' + local
				show_page('page-call-car')
			})
			.catch(() => {
				document.getElementById('title-text').innerText = _date + ' ' + local
				show_page('page-call-car')
			})
	} else {
		alert('Select date, please')
	}
}

function watch_carline() {
	db.ref('carlines/' + _date + '/global').on('value', snap => {
		document.getElementById('car-line-list').innerHTML = ''
		var list = snap.val()
		list.reverse().map(update_carline)
		blink('car-line-list')
	})
}

var screen = document.getElementById('screen')

function insert_digit(it) {
	if (it == '0') {
		if (screen.innerText == '') {
			null
		} else {
			if (screen.innerText.length < 3) screen.innerText += it
		}
	} else {
		if (screen.innerText.length < 3) screen.innerText += it
	}
}

function erase() {
	var value = screen.innerText
	if (value.length != 0) {
		var new_value = value.slice(0, -1)
		screen.innerText = new_value
	}
}

function call_car() {
	
	if (screen.innerText != '') {
		var _car = screen.innerText

    var students_in_car = []

    var students_copy = []

    db.ref('students').get().then(snap => {
      students_copy = snap.val()
  
      students_copy
      .map(student => {
        var _filtered = student.car.filter(i => i == _car)
        if (_filtered.length > 0) students_in_car.push(student)
      })
  
      if (students_in_car.length > 0) {
        var _students = []
  
        var names_in_car = []
  
        function write_names(student) {
          var _name = student.f_name + ' - ' + student.grade
          names_in_car.push(_name)
					student.local = local
          student.car = _car
          student.time = new Date().toLocaleTimeString()
          _students.push(student)
        }
  
        students_in_car.forEach(write_names)
  
        function _confirm() {
          var _names = names_in_car.join(', ')
					confirm_students = _students
					car_called = _car
          
          document.getElementById('index').classList.add('hidden')
          document.getElementById('div-card-confirm').style.display = 'flex'
          document.getElementById('car-number').innerText = _car
          document.getElementById('car-students').innerText = _names

        }
  
        _confirm()
      } else alert('Car ' + _car + ' was not found')
    } )

	} else {
		alert('Insert car number')
	}
}

document.getElementById('cancel-confirm').addEventListener('click', () => {
	document.getElementById('index').classList.remove('hidden')
	document.getElementById('div-card-confirm').style.display = 'none'
	document.getElementById('car-number').innerText = ''
	document.getElementById('car-students').innerText = ''
	document.getElementById('screen').innerText = ''
})

var confirm_students, car_called, bus_called

document.getElementById('ok-confirm').addEventListener('click', () => {
	if(car_or_bus == 'car') {
		confirm_car(car_called, confirm_students)
	} else {
		confirm_bus(bus_called, confirm_students)
	}
	document.getElementById('index').classList.remove('hidden')
	document.getElementById('div-card-confirm').style.display = 'none'
	document.getElementById('car-number').innerText = ''
	document.getElementById('car-students').innerText = ''
	document.getElementById('screen').innerText = ''
})

var car_or_bus

document.getElementById('num-ok').addEventListener('click', () => {
	car_or_bus = 'car'
	call_car()
})

function check_if_exists() {
	return new Promise((resolve, reject) => {
		db.ref('carlines/' + _date + '/global')
			.get()
			.then(snap => {
				watch_carline()
				if (snap.exists()) {
					_carline = snap.val()
					resolve(_carline)
				} else reject(false)
			})
	})
}

function confirm_car(_car, _students) {
	var updated_carline
	check_if_exists()
		.then(carline => {
			var _cars = []
			carline.forEach(student => _cars.push(student.car))
			if (!_cars.includes(_car)) {
				updated_carline = carline.concat(_students)
				db.ref('carlines/' + _date + '/global')
					.set(updated_carline)
					.then(() => {
						document.getElementById('car-line-list').innerHTML = ''
						document.getElementById('screen').innerHTML = ''
						updated_carline.reverse().map(update_carline)
						document.getElementById('car-line-list').scrollTo({
							top: 0,
							left: 0,
							behavior: 'smooth',
						})
						update_(updated_carline)
					})
					.catch(err => alert(err.message))
			} else alert('Car ' + _car + ' has been called already')
		})
		.catch(() => {
			db.ref('carlines/' + _date + '/global')
				.set(_students)
				.then(() => {
					document.getElementById('car-line-list').innerHTML = ''
					document.getElementById('screen').innerHTML = ''
					_students.reverse().map(update_carline)
					document.getElementById('car-line-list').scrollTo({
						top: 0,
						left: 0,
						behavior: 'smooth',
					})
					update_(_students)
				})
				.catch(err => alert(err.message))
		})
}

function update_carline(i) {
	var car = i.car
	var f_name = i.f_name
	var grade = i.grade
	var time = i.time.substring(0, 5)
	var _local = i.local
	if (time.slice(-1) == ":") time = time.slice(0, -1)
	var item = `<div class=${_local} onclick='options("${car}")'>${grade} | ${f_name} | ${time} | ${car} </div>`
	document.getElementById('car-line-list').innerHTML += item
}

function options(car) {
  db.ref('carlines/' + _date + '/global').get().then(snap => {
    var actual_carline = snap.val()
    var _filter = i => i.car != car
    var _filtered = actual_carline.filter(_filter)

    var confirm_text = ''

    function _confirm() {
      confirm_text = `Delete car ${car}?`
      if (window.confirm(confirm_text)) {
        db.ref('carlines/' + _date + '/global').set(_filtered)
				var _filtered_reversed = _filtered.reverse()
				update_(_filtered_reversed)
      }
    }
    _confirm()    
  })
}

function toggle_keypad() {
	var button = document.getElementById('toggle-keypad')
	if (button.innerText == 'ABC') {
		button.innerText = '123'
		document.getElementById('screen').classList.add('hidden')
		document.getElementById('number-keypad').style.display = 'none'
		document.getElementById('letters-keypad').style.display = 'grid'
	} else if (button.innerText == '123') {
		button.innerText = 'ABC'
		document.getElementById('screen').classList.remove('hidden')
		document.getElementById('letters-keypad').style.display = 'none'
		document.getElementById('number-keypad').style.display = 'grid'
	}
}

function call_bus(_bus) {
	car_or_bus = 'bus'
	//FIND BUS' STUDENTS
	var read_bus = student => student.bus.includes(_bus)
	var students_in_bus = students.filter(read_bus)

	if (students_in_bus.length > 0) {
		var _students = []

		var names_in_bus = []

		function write_names(student) {
			var _name = student.f_name + ' - ' + student.grade
			names_in_bus.push(_name)
			student.car = _bus
			student.time = new Date().toLocaleTimeString()
			student.local = local
			_students.push(student)
		}

		students_in_bus.forEach(write_names)

		function _confirm() {
			var _names = names_in_bus.join(', ')
			confirm_students = _students
			bus_called = _bus
			
			document.getElementById('index').classList.add('hidden')
			document.getElementById('div-card-confirm').style.display = 'flex'
			document.getElementById('car-number').innerText = _bus
			document.getElementById('car-students').innerText = _names
		}

		_confirm()
	} else alert('Bus ' + _bus + ' was not found')
}

function confirm_bus(_bus, _students) {
	var updated_carline
	check_if_exists()
		.then(carline => {
			var _buses = []
			carline.forEach(student => _buses.push(student.car))
			if (!_buses.includes(_bus)) {
				updated_carline = carline.concat(_students)
				db.ref('carlines/' + _date + '/global')
					.set(updated_carline)
					.then(() => {
						document.getElementById('car-line-list').innerHTML = ''
						document.getElementById('screen').innerHTML = ''
						updated_carline.reverse().map(update_carline)
						document.getElementById('car-line-list').scrollTo({
							top: 0,
							left: 0,
							behavior: 'smooth',
						})
						update_(updated_carline)
					})
					.catch(err => alert(err.message))
			} else alert('Bus ' + _bus + ' has been called already')
		})
		.catch(() => {
			db.ref('carlines/' + _date + '/global')
				.set(_students)
				.then(() => {
					document.getElementById('car-line-list').innerHTML = ''
					document.getElementById('screen').innerHTML = ''
					_students.reverse().map(update_carline)
					document.getElementById('car-line-list').scrollTo({
						top: 0,
						left: 0,
						behavior: 'smooth',
					})
					update_(_students)
				})
				.catch(err => alert(err.message))
		})
}

function update_(updated_carline) {
	var _elementary_list = []
	var _mid_high_list = []
	var _mid_list = []
	var _high_list = []
	var _prek3_list = []
	var _prek4_list = []
	var _k_list = []
	var _1st_list = []
	var _2nd_list = []
	var _3rd_list = []
	var _4th_list = []
	var _5th_list = []
	var _6th_list = []
	var _7th_list = []
	var _8th_list = []
	var _9th_list = []
	var _10th_list = []
	var _11th_list = []
	var _12th_list = []
	if (updated_carline.length > 0) {
		updated_carline.map(i => {
			var _grade = i.grade.trim()
			switch (_grade) {
				case 'PRE-K3':
						_elementary_list.push(i)
						_prek3_list.push(i)
					break;
				case 'PRE-K4':
						_elementary_list.push(i)
						_prek4_list.push(i)
					break;
				case 'K':
						_elementary_list.push(i)
						_k_list.push(i)
					break;
				case '1ST':
						_elementary_list.push(i)
						_1st_list.push(i)
					break;
				case '2ND':
						_elementary_list.push(i)
						_2nd_list.push(i)
					break;
				case '3RD':
						_elementary_list.push(i)
						_3rd_list.push(i)
					break;
				case '4TH':
						_elementary_list.push(i)
						_4th_list.push(i)
					break;
				case '5TH':
						_elementary_list.push(i)
						_5th_list.push(i)
					break;
				case '6TH':
						_mid_high_list.push(i)
						_mid_list.push(i)
						_6th_list.push(i)
					break;
				case '7TH':
						_mid_high_list.push(i)
						_mid_list.push(i)
						_7th_list.push(i)
					break;
				case '8TH':
						_mid_high_list.push(i)
						_mid_list.push(i)
						_8th_list.push(i)
					break;
				case '9TH':
						_mid_high_list.push(i)
						_high_list.push(i)
						_9th_list.push(i)
					break;
				case '10TH':
						_mid_high_list.push(i)
						_high_list.push(i)
						_10th_list.push(i)
					break;
				case '11TH':
						_mid_high_list.push(i)
						_high_list.push(i)
						_11th_list.push(i)
					break;
				case '12TH':
						_mid_high_list.push(i)
						_high_list.push(i)
						_12th_list.push(i)
					break;
				
				default:
					break;
			}
		})
	}
	var updates = {}
		updates['carlines/' + _date + '/elementary/'] = _elementary_list
		updates['carlines/' + _date + '/mid-high/'] = _mid_high_list
		updates['carlines/' + _date + '/mid/'] = _mid_list
		updates['carlines/' + _date + '/high/'] = _high_list
		updates['carlines/' + _date + '/k/'] = _k_list
		updates['carlines/' + _date + '/pre-k3/'] = _prek3_list
		updates['carlines/' + _date + '/pre-k4/'] = _prek4_list
		updates['carlines/' + _date + '/1st/'] = _1st_list
		updates['carlines/' + _date + '/2nd/'] = _2nd_list
		updates['carlines/' + _date + '/3rd/'] = _3rd_list
		updates['carlines/' + _date + '/4th/'] = _4th_list
		updates['carlines/' + _date + '/5th/'] = _5th_list
		updates['carlines/' + _date + '/6th/'] = _6th_list
		updates['carlines/' + _date + '/7th/'] = _7th_list
		updates['carlines/' + _date + '/8th/'] = _8th_list
		updates['carlines/' + _date + '/9th/'] = _9th_list
		updates['carlines/' + _date + '/10th/'] = _10th_list
		updates['carlines/' + _date + '/11th/'] = _11th_list
		updates['carlines/' + _date + '/12th/'] = _12th_list
		db.ref().update(updates).then(e => console.log(e)).catch(e => alert(e.message))
}

// end carline

//classes

var actual_class
var group

function show_class(id) {

	if (id == 'elementary' ||
			id == 'mid-high' ||
			id == 'mid' ||
			id == 'high') {
				group = true
			} else {
				group = false
			}
	
	var html_collection = document.getElementsByClassName('class-list')
	var classes = Array.prototype.slice.call(html_collection)

	classes.forEach(i => i.style.display = 'none')

	document.getElementById(id).style.display = 'flex'
	document.getElementById('classes-list-div').style.display = 'flex'
	document.getElementById('menu-classes').style.display = 'none'

	document.getElementById(id).innerHTML = 'Loading...'
	
	db.ref('carlines/' + _date + '/' + id).on('value', snap => {
		if (snap.exists()) {
			var class_list = snap.val()
			document.getElementById(id).innerHTML = ''
			actual_class = id
			class_list.forEach(write_list)
			blink(id)
		} else {
			document.getElementById(id).innerHTML = ''
			document.getElementById(id).innerHTML = "Nobody from " + id + " has been called yet."
		}
	})

}

function write_list(i) {
	var f_name = i.f_name
	var l_name = i.l_name
	var grade = i.grade
	var time = i.time.substring(0, 5)
	if (time.slice(-1) == ":") time = time.slice(0, -1)
	var _local = i.local
	var item = group ? 
						`<div class=${_local}>${grade} | ${f_name} ${l_name} | ${time} </div>` :
						`<div class=${_local}>${f_name} ${l_name} | ${time} </div>`
	document.getElementById(actual_class).innerHTML += item
}

document.getElementById('close-page-classes').addEventListener('click', e => {
	document.getElementById('menu-classes').style.display = 'block'
	document.getElementById('classes-list-div').style.display = 'none'
	db.ref('carlines/' + _date).off()
})

document.getElementById('btn-elementary').addEventListener('click', () => show_class('elementary'))
document.getElementById('btn-middle-high').addEventListener('click', () => show_class('mid-high'))
document.getElementById('btn-middle').addEventListener('click', () => show_class('mid'))
document.getElementById('btn-high').addEventListener('click', () => show_class('high'))
document.getElementById('btn-pre-k3').addEventListener('click', () => show_class('pre-k3'))
document.getElementById('btn-pre-k4').addEventListener('click', () => show_class('pre-k4'))
document.getElementById('btn-k').addEventListener('click', () => show_class('k'))
document.getElementById('btn-1st').addEventListener('click', () => show_class('1st'))
document.getElementById('btn-2nd').addEventListener('click', () => show_class('2nd'))
document.getElementById('btn-3rd').addEventListener('click', () => show_class('3rd'))
document.getElementById('btn-4th').addEventListener('click', () => show_class('4th'))
document.getElementById('btn-5th').addEventListener('click', () => show_class('5th'))
document.getElementById('btn-6th').addEventListener('click', () => show_class('6th'))
document.getElementById('btn-7th').addEventListener('click', () => show_class('7th'))
document.getElementById('btn-8th').addEventListener('click', () => show_class('8th'))
document.getElementById('btn-9th').addEventListener('click', () => show_class('9th'))
document.getElementById('btn-10th').addEventListener('click', () => show_class('10th'))
document.getElementById('btn-11th').addEventListener('click', () => show_class('11th'))
document.getElementById('btn-12th').addEventListener('click', () => show_class('12th'))


//end classes

//background animation

function blink(id) {
	document.getElementById(id).style.backgroundColor = 'white'
	setTimeout(() => {
		document.getElementById(id).style.backgroundColor = 'black'
	}, 1000)
	setTimeout(() => {
		document.getElementById(id).style.backgroundColor = 'white'
	}, 2000)
	setTimeout(() => {
		document.getElementById(id).style.backgroundColor = 'black'
	}, 3000)
}

//background animation end


// search student home page
var btn_search_home = document.getElementById('btn-search-h')
btn_search_home.addEventListener('click', () => open_search())

function open_search() {
	document.getElementById('edit-title').innerText = 'Search student'
	show_page('page-edit-student')
	home = true
}
