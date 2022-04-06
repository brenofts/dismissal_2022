// firebase configuration 

const firebaseConfig = {
  apiKey: "AIzaSyDoUcPh4_4QiDXXCFI5RVQwBj_aomGvLmA",
  // databaseURL: "https://bis-dimissal-default-rtdb.firebaseio.com",
  authDomain: "bis-dismissal.firebaseapp.com",
  projectId: "bis-dismissal",
  storageBucket: "bis-dismissal.appspot.com",
  messagingSenderId: "1019941316312",
  appId: "1:1019941316312:web:92e539af021728e6d419ad"
};
firebase.initializeApp(firebaseConfig)
const db = firebase.database()

// end firebase configuration


//navigation

const reload = () => document.location.reload()

function show_page(id) {

  var html_collection = document.getElementsByClassName('page')
  var pages = Array.prototype.slice.call(html_collection)

  pages.forEach(i => i.classList.add('hidden'))

  var page = document.getElementById(id)

  page.classList.remove('hidden')

  switch (id) {
    case 'page-admin':
      document.getElementById('title-text').innerText = 'Admin Page'
      break;
    case 'page-home':
      document.getElementById('title-text').innerText = 'Dismissal'
      break;
    case 'page-call-car':
      document.getElementById('title-text').innerText = _date
      break;
  
    default:
      break;
  }
  
}




//end navigation

//home page buttons

var input_date = document.getElementById('carline-date')

function set_today() {
  var year = new Date().getFullYear()
  var month = new Date().getMonth() + 1
  month < 10 ? month = '0' + month.toString() : null
  var day = new Date().getDate()
  day < 10 ? day = '0' + day.toString() : null
  var today = year + '-' + month + '-' + day
  input_date.value = today
}

var btn_carline = document.getElementById('btn-carline')
btn_carline.addEventListener('click', e => {
  
  set_today()

  db.ref('students').once('value')
  .then(snap => {
    students = snap.val()

    // CATCH BUS LETTERS
    var all_buses = []
    var look_for_bus = i => {
      if (i.bus[0] != "0") {
        i.bus.forEach(item => all_buses.push(item))
      }
    }
    students.forEach(look_for_bus)

    var collect_bus_letters = i => {
      if (!bus_letters.includes(i)) bus_letters.push(i)
    }

    all_buses.forEach(collect_bus_letters)

    document.getElementById("bus-letters").innerHTML = ''
    
    bus_letters.forEach(letter => {
      var _div = `<div class="num" onclick="call_bus('${letter}')">${letter}</div>`
      document.getElementById("bus-letters").innerHTML += _div
    })

  })
  .catch(err => alert(err.message))

  show_page('page-carline')
})


var btn_admin = document.getElementById('btn-admin')
btn_admin.addEventListener('click', e => {
  show_page('page-admin')
  home = false
})

//end home page buttons


// carline

var _date
var _carline = []

function select_date() {
  _date = input_date.value

  if (!_date == '') {
    
    check_if_exists()
    .then(carline =>{
      document.getElementById('screen').innerHTML = ''
      document.getElementById('car-line-list').innerHTML = ''
      carline.reverse().map(update_carline)
      show_page('page-call-car')
    })
    .catch(() => {
      show_page('page-call-car')
    })
  } else {
    alert("Select date, please")
  }

}



function watch_carline() {
  db.ref('carlines/' + _date).on('value', snap => {
    document.getElementById('car-line-list').innerHTML = ''
    var list = snap.val()
    list.reverse().map(update_carline)
  })
}

function create_carline() {
  show_page('page-call-car')
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

var students = []
var bus_letters = []

function call_car() {
  if (screen.innerText != '') {
    var confirm_text = ''
    var _car = screen.innerText
    
  //FIND CAR'S STUDENTS
  var read_car = student => student.car == _car
  var students_in_car = students.filter(read_car)
    
  if (students_in_car.length > 0) {

  var _students = []

  var names_in_car = []

  function write_names(student) {
    var _name = student.f_name + ' - ' + student.grade 
    names_in_car.push(_name)
    student.car = _car
    student.moment = new Date().toLocaleTimeString()
    _students.push(student)
  }

  students_in_car.forEach(write_names)

  function _confirm() {
    var _names = names_in_car.join(', ')
    confirm_text = `CAR:\n${_car}\nSTUDENTS:\n${_names}`
    if(window.confirm(confirm_text)) {
      confirm_car(_car, _students)
    }
  }

  _confirm()
  }
  else alert('Car ' + _car + ' was not found')
  } else {
    alert('Insert car number')
  }
}

document.getElementById('num-ok').addEventListener('click', call_car)


function check_if_exists() {
	return new Promise((resolve, reject) => {
    db.ref('carlines/' + _date).get().then(snap => {
      watch_carline()
      if (snap.exists()) {
        _carline = snap.val()
        resolve(_carline)
      }
      else reject(false)
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
      db.ref('carlines/' + _date).set(updated_carline)
      .then(() => {
        document.getElementById('car-line-list').innerHTML = ''
        document.getElementById('screen').innerHTML = ''
        updated_carline.reverse().map(update_carline)
        document.getElementById('car-line-list').scrollTo({
          top: 0,
				  left: 0,
				  behavior: 'smooth'
        })
        
      })
      .catch(err => alert(err.message))
    } else alert('Car ' + _car + ' has been called already')
  })
  .catch(() => {
    db.ref('carlines/' + _date).set(_students)
    .then(() => {
      document.getElementById('car-line-list').innerHTML = ''
      document.getElementById('screen').innerHTML = ''
      _students.reverse().map(update_carline)
      document.getElementById('car-line-list').scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    })
    .catch(err => alert(err.message))
  })
}

function update_carline(i) {
  var car = i.car
  var f_name = i.f_name
  var grade = i.grade
  var moment = i.moment
  var item = `<div >${grade} | ${f_name} | ${moment} | ${car} </div>`
  document.getElementById('car-line-list').innerHTML += item
  document.getElementById('car-line-list').style.animation = 'blink .7s'
}

function toggle_keypad() {
  var button = document.getElementById('toggle-keypad')
  if (button.innerText == 'ABC') {
    button.innerText = '123'
    document.getElementById("screen").classList.add('hidden')
    document.getElementById("number-keypad").style.display = 'none'
    document.getElementById("letters-keypad").style.display = 'grid'
  }
  else if (button.innerText == '123') {
    button.innerText = 'ABC'
    document.getElementById("screen").classList.remove('hidden')
    document.getElementById("letters-keypad").style.display = 'none'
    document.getElementById("number-keypad").style.display = 'grid'
  }
}


function call_bus(_bus) {
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
    student.moment = new Date().toLocaleTimeString()
    _students.push(student)
  }

  students_in_bus.forEach(write_names)

  function _confirm() {
    var _names = names_in_bus.join(', ')
    confirm_text = `BUS:\n${_bus}\nSTUDENTS:\n${_names}`
    if(window.confirm(confirm_text)) {
      confirm_bus(_bus, _students)
    }
  }

  _confirm()
  }
  else alert('Bus ' + _bus + ' was not found')
}


function confirm_bus(_bus, _students) {
    //CONTINUE FROM HERE
    //COLLECT CARLINE INFO AND UPADATE
    //CHECK CONFIRM_CAR()
  var updated_carline
  check_if_exists()
  .then(carline => {
    var _buses = []
    carline.forEach(student => _buses.push(student.car))
    if (!_buses.includes(_bus)) {
      updated_carline = carline.concat(_students)
      db.ref('carlines/' + _date).set(updated_carline)
      .then(() => {
        document.getElementById('car-line-list').innerHTML = ''
        document.getElementById('screen').innerHTML = ''
        updated_carline.reverse().map(update_carline)
        document.getElementById('car-line-list').scrollTo({
          top: 0,
				  left: 0,
				  behavior: 'smooth'
        })
        
      })
      .catch(err => alert(err.message))
    } else alert('Bus ' + _bus + ' has been called already')
  })
  .catch(() => {
    db.ref('carlines/' + _date).set(_students)
    .then(() => {
      document.getElementById('car-line-list').innerHTML = ''
      document.getElementById('screen').innerHTML = ''
      _students.reverse().map(update_carline)
      document.getElementById('car-line-list').scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    })
    .catch(err => alert(err.message))
  })
}


// end carline


// search student home page
var btn_search_home = document.getElementById('btn-search-h')
btn_search_home.addEventListener('click', () => open_search())

var home

function open_search() {
  document.getElementById('edit-title').innerText = 'Search student'
  show_page('page-edit-student')
  home = true
}

// alert message  
var div_message = document.getElementById('div-message')
var message_box = document.getElementById('message-box')


// animate list background

function blink(mutations) {
  document.getElementById('car-line-list').style.backgroundColor = 'white'
  setTimeout(() => {
    document.getElementById('car-line-list').style.backgroundColor = 'black'
  }, 1000);
  setTimeout(() => {
    document.getElementById('car-line-list').style.backgroundColor = 'white'
  }, 2000);
  setTimeout(() => {
    document.getElementById('car-line-list').style.backgroundColor = 'black'
  }, 3000);
}

var observer = new MutationObserver(blink)
observer.observe(document.getElementById('car-line-list'), {childList: true})

// animate list background END

// filter grades to display

function open_grade(grade) {
  var _grade = "4TH"

  db.ref('carlines/2022-03-29').on('value', snap => {
    document.getElementById('car-line-list').innerHTML = ''
    var all_grades = snap.val()
    
    var filter_grade = i => i.grade === _grade

    var filtered_list = all_grades.filter(filter_grade)

    filtered_list.map(update_list)

  })

  // continue from here
  // create a new car-line-list on grades' page

  function update_list(i) {
    var car = i.car
    var f_name = i.f_name
    var grade = i.grade
    var moment = i.moment
    var item = `<div >${grade} | ${f_name} | ${moment} | ${car} </div>`
    document.getElementById('car-line-list').innerHTML += item
    document.getElementById('car-line-list').style.animation = 'blink .7s'
  }

}