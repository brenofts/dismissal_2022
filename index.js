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

// db.ref('carlines/2022-03-04').set(['100', 'A', 'B'])

function show_page(id) {

  var html_collection = document.getElementsByClassName('page')
  var pages = Array.prototype.slice.call(html_collection)

  pages.forEach(i => i.classList.add('hidden'))

  // var hide = Array.prototype.filter.call(pages, i => i.classList.add('hidden'))

  var page = document.getElementById(id)

  page.classList.remove('hidden')

}




//end navigation

//home page buttons

var btn_carline = document.getElementById('btn-carline')
btn_carline.addEventListener('click', e => show_page('page-carline'))

//end home page buttons


// carline

var input_date = document.getElementById('carline-date')

function select_date() {
  var date_selected = input_date.value

  if (!date_selected == '') {
    check_if_exists(date_selected)
   .then(carline => open_carline(carline.carline, carline.date))
   .catch(e => create_carline(date_selected))
  } else {
    alert("Select date, please")
  }

}

function check_if_exists(date) {
	return new Promise((resolve, reject) => {
    db.ref('carlines/' + date).get().then(snap => {
      if (snap.exists()) {
        var result = {
          date: date,
          carline: snap.val()
        }
        resolve(result)
      }
      else reject(false)
    })
	})
}


function open_carline(carline, date) {

  console.log('Carline exists', carline, date) 
  carline.forEach(search_car)
  
}

function search_car(register) {
  db.ref('students').once('value').then(snap => {
    var students = snap.val()

    //FIND CAR'S STUDENTS
    var read_car = student => student.car.includes(register.car)
    var students_in_car = students.filter(read_car)
    
    // HOW CARLINE LIST WILL BE DISPLAYED
    var write_line = student => console.log(register.car, student.f_name, student.grade, register.time)
    
    
    students_in_car.forEach(write_line)
  })
}


function create_carline(date) {
  console.log('Create carline ', date)
}

// end carline

