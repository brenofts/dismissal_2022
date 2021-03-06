// pages

const student_page = document.getElementById('page-student')
const new_student_page = document.getElementById('page-new-student')
const edit_student_page = document.getElementById('page-edit-student')

// html elements

const div_edit_student = document.getElementById('div-edit-student')
const div_search = document.getElementById('div-search')

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

// const btn_student = document.getElementById('btn-student')

// const btn_new_student = document.getElementById('btn-new-student')
const btn_cancel_new_student = document.getElementById('btn-new-student-cancel')
const btn_cancel_search = document.getElementById('btn-search-cancel')
const btn_ok_new_student = document.getElementById('btn-new-student-ok')


// btn_student.addEventListener('click', e => show_page('student_page'))
// btn_new_student.addEventListener('click', e => show_page('page-new-student'))
btn_cancel_new_student.addEventListener('click', e => show_page('page-admin'))
btn_cancel_search.addEventListener('click', e => {
  if (home) show_page('page-home')
  else show_page('page-admin')
  div_list_result.innerHTML = ''
  input_search_student.value = ''
  div_edit_student.classList.add('hidden')
  div_search.classList.remove('hidden')
})


// new student

function check_new_student() {
    
  var first_name = input_first_name.value
  var last_name = input_last_name.value
  var grade = input_grade.value.toUpperCase()
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

      // var cars_and_buses = []
      var _cars = []
      var _buses = []

      const trim_car = item => {
        if (!item == '') {
          _cars.push(item.trim())
        } else {
          car_values = []
        }
      }
      const trim_bus = item => {
        if (!item == '') {
          _buses.push(item.trim().toUpperCase())
        } else {
          bus_values = []
        }
      }

      car_values.forEach(trim_car)
      bus_values.forEach(trim_bus)
      
      if(_cars.length == 0){
        new_student["car"] = ["0"]
      } else {
        new_student["car"] = _cars
      }
      if(_buses.length == 0){
        new_student["bus"] = ["0"]
      } else {
        new_student["bus"] = _buses
      }

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


// edit student

// const btn_edit_student = document.getElementById('btn-edit-student')
// btn_edit_student.addEventListener('click', e => {
//   home = false
//   document.getElementById('edit-title').innerText = 'Edit student'
//   show_page('page-edit-student')
// })

const input_search_student = document.getElementById('i-search-student')
const btn_search_student = document.getElementById('btn-search')
const div_list_result = document.getElementById('list-result')

var students_search = []
var student, index

var cars_list, buses_list

btn_search_student.addEventListener('click', e => {
  div_list_result.innerHTML = ''
  if(!input_search_student.value == '') {
    var name = input_search_student.value
    db.ref('students/data').once('value', snap => {
      students_search = snap.val()
      var find_student = student => student[1].toUpperCase().includes(name.toUpperCase())
      var result = students_search.filter(find_student)
      if (result.length < 1) {
        alert('No register for ' + name)
      } else {
        function list_result(i) {
          cars_list = i[3]
          buses_list = i[4]
          var f_name = i[1]
          var l_name = i[0]
          var grade = i[2]
          index = students_search.indexOf(i)
          var item

          if (home) {
            item = `<div>${f_name} ${l_name} | ${grade} | ${cars_list} | ${buses_list}</div>`
          } else {
            item = `<div onclick="edit_student(${index})">${cars_list} | ${buses_list} | ${f_name} ${l_name} | ${grade}</div>`
          }

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
  input_edit_car.value = student.car.toString()
  input_edit_bus.value = student.bus.toString()
  input_edit_grade.value = student.grade

  div_edit_student.classList.remove('hidden')
  div_search.classList.add('hidden')
}

const btn_cancel_edit = document.getElementById('btn-cancel-edit')
btn_cancel_edit.addEventListener('click', e => {
  show_page('page-admin')
  input_edit_bus.value = ''
  input_edit_car.value = ''
  input_edit_grade.value = ''
  input_search_student.value = ''
  div_edit_student.classList.add('hidden')
  div_search.classList.remove('hidden')
})

function check_edit() {
  var car_values = input_edit_car.value.split(',')
  var bus_values = input_edit_bus.value.split(',')

  var _cars = []
  var _buses = []
  const trim_car = item => {
    if (!item == '') {
      _cars.push(item.trim())
    }
  }
  const trim_bus = item => {
    if (!item == '') {
      _buses.push(item.trim().toUpperCase())
    }
  }

  car_values.forEach(trim_car)
  bus_values.forEach(trim_bus)


  if(_cars.length == 0){
    student["car"] = ["0"]
  } else {
    student["car"] = _cars
  }
  if(_buses.length == 0){
    student["bus"] = ["0"]
  } else {
    student["bus"] = _buses
  }

  student["grade"] = input_edit_grade.value.toUpperCase()

  var confirm_text = "CHECK INFO BEFORE UPDATE \n" +
                     "\nFirst name: " + student.f_name +
                     "\nLast name: " + student.l_name + 
                     "\nGrade: " + input_edit_grade.value.toUpperCase() +
                     "\nCar: " + input_edit_car.value +
                     "\nBus: " + input_edit_bus.value


  if (window.confirm(confirm_text)) {
    confirm_edit()
  }

}

var btn_ok_edit = document.getElementById('btn-ok-edit')
btn_ok_edit.addEventListener('click', e => check_edit())

function confirm_edit() {
  db.ref('students/' + index).set(student).then(() => {
    alert('Student successfully updated!')
    document.location.reload()
  }).catch(e => alert('Something went wrong. ' + e.message))
}

var btn_ok_delete = document.getElementById('btn-ok-delete')
btn_ok_delete.addEventListener('click', e => check_delete())

function check_delete() {
  var confirm_text = "CHECK INFO BEFORE DELETE \n" +
                      "\nFirst name: " + student.f_name +
                      "\nLast name: " + student.l_name + 
                      "\nGrade: " + input_edit_grade.value +
                      "\nCar: " + input_edit_car.value +
                      "\nBus: " + input_edit_bus.value
  if (window.confirm(confirm_text)) {
    confirm_delete()
  }
}

function confirm_delete() {
    
  db.ref('students').once('value')
  .then(snap => {
    var _students = snap.val()
    _students.splice(index,1)
    
    db.ref('students').set(_students)
    .then(() => {
      alert('Student successfully deleted!')
      document.location.reload()
      })
    .catch(e => alert('Something went wrong. ' + e.message))
  })
}


// op????o de cancelar um carro chamado por engano