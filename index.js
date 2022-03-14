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

  // var hide = Array.prototype.filter.call(pages, i => i.classList.add('hidden'))

  var page = document.getElementById(id)

  page.classList.remove('hidden')

  if(id == 'page-admin') {
    document.getElementById('title-text').innerText = 'Admin Page'
  }
  if(id == 'page-home') {
    document.getElementById('title-text').innerText = 'Dismissal'
  }
  if(id == 'page-call-car') {
    document.getElementById('title-text').innerText = _date
  }
  
}




//end navigation

//home page buttons

var btn_carline = document.getElementById('btn-carline')
btn_carline.addEventListener('click', e => show_page('page-carline'))

var btn_admin = document.getElementById('btn-admin')
btn_admin.addEventListener('click', e => {
  show_page('page-admin')
  home = false
})

//end home page buttons


// carline

var _date
var _carline = []
var input_date = document.getElementById('carline-date')

function select_date() {
  _date = input_date.value

  if (!_date == '') {
    show_page('page-call-car')
  } else {
    alert("Select date, please")
  }

}

function check_if_exists() {
	return new Promise((resolve, reject) => {
    db.ref('carlines/' + _date).get().then(snap => {
      if (snap.exists()) {
        _carline = snap.val()
        resolve(_carline)
      }
      else reject(false)
    })
	})
}


function open_carline() {

  console.log('Carline exists', _carline, _date) 
  _carline.forEach(search_car)
  watch_carline()
}

function search_car(register) {
  db.ref('students').once('value').then(snap => {
    var students = snap.val()

    //FIND CAR'S STUDENTS
    var read_car = student => student.car.includes(register.car)
    var students_in_car = students.filter(read_car)
    
    // HOW CARLINE LIST WILL BE DISPLAYED
    function write_line(student) {
      console.log(register.car, student.f_name, student.grade, register.time)
    }
    students_in_car.forEach(write_line)
  })
}


function watch_carline() {
  db.ref('carlines/' + _date).on('value', snap => {
    console.log(snap.val())
  } )
}

function create_carline() {
  console.log('Create carline ', _date)
  show_page('page-call-car')
}

var screen = document.getElementById('screen')

function insert_digit(it) {
  if (screen.innerText.length < 3) screen.innerText += it
}

function erase() {
  var value = screen.innerText
  if (value.length != 0) {
    var new_value = value.slice(0, -1)
    screen.innerText = new_value
  }
}

function call_car() {
  var confirm_text = ''
  var _car = screen.innerText
  db.ref('students').once('value').then(snap => {
    var students = snap.val()

    //FIND CAR'S STUDENTS
    var read_car = student => student.car.includes(_car)
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
        confirm_car(_students)
      }
    }

    _confirm()
    }
    else alert('Car ' + _car + ' was not found')
  })
}


function confirm_car(_students) {
  check_if_exists()
  .then(carline => {
    var update_carline = carline.concat(_students)
    console.log(update_carline)
  })
  .catch(() => {
    db.ref('carlines/' + _date).set(_students)
    .then(() => alert('Ok'))
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
