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


// pages

const student_page = document.getElementById('page-student')
const new_student_page = document.getElementById('page-new-student')
const edit_student_page = document.getElementById('page-edit-student')

// html elements

const div_edit_student = document.getElementById('div-edit-student')
const div_search = document.getElementById('div-search')

// navigation

var pages = [student_page, new_student_page, edit_student_page]

function show_page(page) {
  div_list_result.innerHTML = ''
  clear_inputs()
  div_edit_student.classList.add('hidden')
  div_search.classList.remove('hidden')
  const show = element => element.classList.remove('hidden')
  const hide = element => element.classList.add('hidden')
  pages.map(page => hide(page))
  show(page)
}


// clear input data

const input_last_name = document.getElementById('i-last-name')
const input_first_name = document.getElementById('i-first-name')
const input_grade = document.getElementById('i-grade')
const input_car = document.getElementById('i-car')
const input_bus = document.getElementById('i-bus')
const input_edit_grade = document.getElementById('edit-student-grade')
const input_edit_car = document.getElementById('edit-student-car')
const input_edit_bus = document.getElementById('edit-student-bus')

function clear_inputs() {
  input_bus.value = ''
  input_car.value = ''
  input_car.value = ''
  input_first_name.value = ''
  input_last_name.value = ''
  input_grade.value = ''
  input_edit_car.value = ''
  input_edit_bus.value = ''
  // input_edit_grade.value = ''
  input_search_student.value = ''
}


// buttons

const btn_student = document.getElementById('btn-student')

const btn_new_student = document.getElementById('btn-new-student')
const btn_cancel_new_student = document.getElementById('btn-new-student-cancel')
const btn_cancel_search = document.getElementById('btn-search-cancel')
const btn_ok_new_student = document.getElementById('btn-new-student-ok')


// btn_student.addEventListener('click', e => show_page(student_page))
btn_new_student.addEventListener('click', e => show_page(new_student_page))
btn_cancel_new_student.addEventListener('click', e => show_page(student_page))
btn_cancel_search.addEventListener('click', e => show_page(student_page))


// new student

function check_new_student() {
    
  var first_name = input_first_name.value
  var last_name = input_last_name.value
  var grade = input_grade.value
  var car = input_car.value
  var bus = input_bus.value
  var confirm_text = "CHECK INFO BEFORE REGISTER \n" +
                     "\nFirst name: " + first_name +
                     "\nLast name: " + last_name + 
                     "\nGrade: " + grade +
                     "\nCar: " + car +
                     "\nBus: " + bus

  if (check_inputs()) {
    if (window.confirm(confirm_text)) {
      var new_student = {
        "l_name" : last_name,
        "f_name" : first_name,
        "grade" : grade,
        "car" : [0]
      }
      
      var car_values = input_car.value.split(',')
      var bus_values = input_bus.value.split(',')

      var cars_and_buses = []

      const trim_car = item => {
        if (!item == '') {
          cars_and_buses.push(item.trim())
        } else {
          car_values = []
        }
      }
      const trim_bus = item => {
        if (!item == '') {
          cars_and_buses.push(item.trim().toUpperCase())
        } else {
          bus_values = []
        }
      }

      car_values.forEach(trim_car)
      bus_values.forEach(trim_bus)

      // new_student["car"] = [parseInt(car), bus.trim()]

      // if (bus == '') {
      //   new_student["car"] = [parseInt(car)]
      // } 
      
      // if (car == '') {
      //   new_student["car"] = [bus.trim()]
      // }

      // if (bus == '' && car == '') {
      //   new_student["car"] = []
      // }

      
      if(cars_and_buses.length == 0){
        new_student["car"] = [0]
      } else {
        new_student["car"] = cars_and_buses
      }

      // console.log(new_student)
      register_new_student(new_student)
    }
  } else {
    alert('Check fields, please')
  }
}

function register_new_student(new_student) {
  db.ref('students').once('value', snap => {
    var students = snap.val()
    students.push(new_student)
    db.ref('students').set(students).then(() => {
      alert("New student successfully registered")
      document.location.reload()
    }).catch(e => alert('Something went wrong \n' + e.message))
  })
}

function check_inputs() {
  var check_1 = input_last_name.value == '' ? false : true
  var check_2 = input_first_name.value == '' ? false : true
  var check_3 = input_grade.value == '' ? false : true
  var check_all = false
  if (check_1 && check_2 && check_3) {
    check_all = true
  }
  return check_all
}

btn_ok_new_student.addEventListener('click', e => check_new_student())


// example - reading database

db.ref('students').once('value', snap => {
  var students = snap.val()
  var car = 666
  var find_car = student => student.car.includes(car)
  var result = students.filter(find_car)
  var time = new Date().toLocaleTimeString()
  function edit(student) {
    var name = student.f_name
    var grade = student.grade
    console.log(car + ' - ' + name + ' - ' + grade + ' - ' + time)
  }
  result.map(edit)
})


// edit student

const btn_edit_student = document.getElementById('btn-edit-student')
btn_edit_student.addEventListener('click', e => show_page(edit_student_page))

const input_search_student = document.getElementById('i-search-student')
const btn_search_student = document.getElementById('btn-search')
const div_list_result = document.getElementById('list-result')

var students_search = []
var student, index

btn_search_student.addEventListener('click', e => {
  div_list_result.innerHTML = ''
  if(!input_search_student.value == '') {
    var name = input_search_student.value
    db.ref('students').once('value', snap => {
      students_search = snap.val()
      var find_student = student => student.f_name.toUpperCase().includes(name.toUpperCase())
      var result = students_search.filter(find_student)
      if (result.length < 1) {
        alert('No register for ' + name)
      } else {
        function list_result(i) {
          var cars = i.car.join(', ')
          var f_name = i.f_name
          var l_name = i.l_name
          var grade = i.grade
          index = students_search.indexOf(i)
          var item = `<div onclick="edit_student(${index})">${cars} | ${f_name} ${l_name} | ${grade}</div>`
          div_list_result.innerHTML += item
        }
        result.map(list_result)
      }
    })
  } else {
    alert('Check fields, please')
  }
})



function edit_student(_index) {
  index = _index
  div_list_result.innerHTML = ''
  student = students_search[_index]
  var name = student.f_name + ' ' + student.l_name
  var title_name = document.getElementById('edit-student-name')
  title_name.innerText = name
  // input_edit_grade.value = student.grade

  var cars = student.car
  function car_or_bus(item) {
    if (typeof item === 'number') {
      if (input_edit_car.value == '') {
        input_edit_car.value += item
      } else {
        input_edit_car.value += ', ' + item
      }
    }
    if (typeof item === 'string') {
      if (input_edit_bus.value == '') {
        input_edit_bus.value += item
      } else {
        input_edit_bus.value += ', ' + item
      }
    }
  }
  cars.forEach(car_or_bus)

  // input_edit_car.value = student.car

  div_edit_student.classList.remove('hidden')
  div_search.classList.add('hidden')
}

const btn_cancel_edit = document.getElementById('btn-cancel-edit')
btn_cancel_edit.addEventListener('click', e => show_page(student_page))

function check_edit() {
  var car_values = input_edit_car.value.split(',')
  var bus_values = input_edit_bus.value.split(',')

  var cars_and_buses = []

  const trim_car = item => {
    if (!item == '') {
      cars_and_buses.push(item.trim())
    } else {
      car_values = []
    }
  }
  const trim_bus = item => {
    if (!item == '') {
      cars_and_buses.push(item.trim().toUpperCase())
    } else {
      bus_values = []
    }
  }

  car_values.forEach(trim_car)
  bus_values.forEach(trim_bus)


  if(cars_and_buses.length == 0){
    student["car"] = [0]
  } else {
    student["car"] = cars_and_buses
  }

  var confirm_text = "CHECK INFO BEFORE UPDATE \n" +
                     "\nFirst name: " + student.f_name +
                     "\nLast name: " + student.l_name + 
                     "\nGrade: " + student.grade +
                     "\nCar: " + input_edit_car.value +
                     "\nBus: " + input_edit_bus.value


  if (window.confirm(confirm_text)) {
    confirm_edit()
  }
  // students_search.splice(index, 1, student)

}

var btn_ok_edit = document.getElementById('btn-ok-edit')
btn_ok_edit.addEventListener('click', e => check_edit())

function confirm_edit() {
  db.ref('students/' + index).set(student).then(() => {
    alert('Student successfully updated!')
    document.location.reload()
  }).catch(e => alert('Something went wrong. ' + e.message))
}

// opção de cancelar um carro chamado por engano