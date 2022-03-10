// firebase configuration 

const firebaseConfig = {
  apiKey: "AIzaSyCKI77Sg3wsVUBlxwTFAu5WBjo9MPwp-VU",
  authDomain: "dismissal-2022.firebaseapp.com",
  databaseURL: "https://dismissal-2022-default-rtdb.firebaseio.com",
  projectId: "dismissal-2022",
  storageBucket: "dismissal-2022.appspot.com",
  messagingSenderId: "489937329809",
  appId: "1:489937329809:web:d9c0ac631cac20bf87e930"
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
  
}




//end navigation

//home page buttons

var btn_carline = document.getElementById('btn-carline')
btn_carline.addEventListener('click', e => show_page('page-carline'))

var btn_admin = document.getElementById('btn-admin')
btn_admin.addEventListener('click', e => show_page('page-admin'))

//end home page buttons


// carline

var _date
var _carline = []
var input_date = document.getElementById('carline-date')

function select_date() {
  _date = input_date.value

  if (!_date == '') {
    check_if_exists()
   .then(() => open_carline())
   .catch(() => create_carline())
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
}

// end carline


// search student home page
var btn_search_home = document.getElementById('btn-search-h')
btn_search_home.addEventListener('click', () => open_search())

function open_search() {
  document.getElementById('edit-title').innerText = 'Search student'
  show_page('page-edit-student')
}
