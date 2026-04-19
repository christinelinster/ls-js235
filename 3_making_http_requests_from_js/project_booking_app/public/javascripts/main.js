class TimeoutError extends Error {
  constructor(message = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

class BookingAppUI {
  constructor() {
    this.schedulesDiv = document.querySelector('#schedules');
    this.newStaffForm = document.querySelector('#add_staff');

    this.addScheduleBtn = document.querySelector('#btnAdd');
    this.newScheduleForm = document.querySelector('#add_schedule');

    this.schedules = null;
    this.scheduleTally = null;
    this.staffMembers = null;
    this.scheduleCount = 0;

    this.main();
  }

  withTimeout(promise, delay) {
    let timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new TimeoutError()), delay)
    })

    return Promise.race([promise, timeoutPromise])
  }

  async fetchSchedules() {
    try {
      let response = await this.withTimeout(fetch('/api/schedules'), 5000)
      let data = await response.json();
      if (data) {
        this.schedules = data;
      }

    } catch (e) {
      if (e instanceof TimeoutError) {
        alert('It is taking longer than usual, please try again later.');
      } else {
        console.error(e)
      }
    } finally {
      alert('The request is completed.')
    }
  }

  tallySchedules() {
    let count = {}
    if (!this.schedules) return;

    this.schedules.forEach(({ staff_id }) => {
      let key = `staff ${staff_id}`
      count[key] = (count[key] || 0) + 1;
    })
    this.scheduleTally = count;
  }


  alertScheduleTally() {
    if (!this.schedules) return;

    if (this.schedules.length === 0) {
      alert('No schedules available for booking.')
    } else {
      this.tallySchedules();
      alert(Object.entries(this.scheduleTally).map(([id, count]) => `${id}: ${count}`).join('\n'))
    }
  }


  async fetchStaff() {
    try {
      let response = await fetch('/api/staff_members')
      let data = await response.json()

      if (data) {
        this.staffMembers = data;
      }

    } catch (e) {
      console.error(e)
    }
  }

  async handleAddStaff(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let json = JSON.stringify(Object.fromEntries(formData.entries()))

    let response = await fetch(`${form.action}`, {
      method: form.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: json
    })

    if (response.status === 201) {
      let data = await response.json();
      alert(`Sucessfully created staff with id: ${data.id}`)
    } else if (response.status === 400) {
      alert('Staff can not be created. Check your inputs.')
    }
  }

  addScheduleTemplate() {
    this.scheduleCount = this.schedulesDiv.children.length + 1;

    let options = this.staffMembers.map(staff =>
      `<option value=${staff.id}>${staff.name}</option>`
    ).join('')

    let template = `<fieldset id="schedule_${this.scheduleCount}">
        <legend>Schedule ${this.scheduleCount}</legend>

        <div>
          <label for="staff_${this.scheduleCount}">Staff Name:</label>
          <select id="staff_${this.scheduleCount}" name="staff_${this.scheduleCount}">
            ${options}
          </select>
        </div>

        <div>
          <label for="date_${this.scheduleCount}">Date:</label>
          <input type="text" id="date_${this.scheduleCount}" name="date_${this.scheduleCount}" placeholder="mm-dd-yy">
        </div>

        <div>
          <label for="time_${this.scheduleCount}">Time:</label>
          <input type="text" id="time_${this.scheduleCount}" name="time_${this.scheduleCount}" placeholder="hh:mm">
        </div>

      </fieldset>`

    this.schedulesDiv.insertAdjacentHTML('beforeend', template)
  }

  async handleAddSchedule(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let objEntries = Object.fromEntries(formData.entries())

    let schedules = []

    for (let i = 1; i <= this.scheduleCount; i++) {
      let newSchedule = {}
      newSchedule['staff_id'] = objEntries[`staff_${i}`]
      newSchedule['date'] = objEntries[`date_${i}`]
      newSchedule['time'] = objEntries[`time_${i}`]

      schedules.push(newSchedule)
    }

    let json = JSON.stringify({ schedules })

    let response = await fetch('/api/schedules', {
      method: form.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: json
    })

    let data = await response.text();
    alert(data)

    if (response.status === 201) {
      form.reset()
    }

  }

  async main() {
    // Exercise 1: fetch schedules
    await this.fetchSchedules();
    // this.alertScheduleTally();

    // Exercise 2: adding staff
    this.newStaffForm.addEventListener('submit', event => this.handleAddStaff(event))

    // Exercise 3: adding schedules
    await this.fetchStaff()
    this.addScheduleBtn.addEventListener('click', event => this.addScheduleTemplate(event))
    this.newScheduleForm.addEventListener('submit', event => this.handleAddSchedule(event))
  }

}

class BookingUI {
  constructor() {
    this.bookingForm = document.querySelector('#bookings')
    this.newStudentForm = document.querySelector('#add_student')
    this.availableSchedules = null;
    this.students = null;
    this.staffMembers = null;

    this.main();


    this.bookingForm.addEventListener('submit', event => this.handleBooking(event));
    this.newStudentForm.addEventListener('submit', event => this.handleAddStudent(event));
  }

  async fetchAvailableSchedules() {
    try {
      let response = await fetch('/api/schedules')
      let data = await response.json();
      if (data) {
        this.availableSchedules = data.filter(schedule => !schedule.student_email)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async fetchStaff() {
    try {
      let response = await fetch('/api/staff_members')
      let data = await response.json()

      if (data) {
        this.staffMembers = data;
      }

    } catch (e) {
      console.error(e)
    }
  }

  async fetchStudents() {
    try {
      let response = await fetch('/api/students')
      let data = await response.json()
      this.students = data;
    } catch (e) {
      console.error(e)
    }
  }

  staffIdToName(id) {
    return this.staffMembers.find(staff => staff.id === id).name;
  }


  renderAvailableSchedules() {
    let scheduleSelector = this.bookingForm.querySelector('#id');
    let options = this.availableSchedules.map(({ id, staff_id, date, time }) => (
      `<option value=${id}>${this.staffIdToName(staff_id)} | ${date} | ${time}</option>`
    )).join('')

    scheduleSelector.innerHTML = options;
  }

  renderNewStudentForm(data) {
    let studentInfo = this.newStudentForm.querySelector('div#student_info');
    studentInfo.querySelector('#email').value = data.email;
    studentInfo.querySelector('#booking_sequence').value = data.booking_sequence;

    this.newStudentForm.style.display = 'block';
  }

  async handleAddStudent(event) {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    let json = JSON.stringify(Object.fromEntries(formData.entries()))

    let response = await fetch(form.action, {
      method: form.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: json,
    })

    let result = await response.text();
    alert(result)

    if (response.status === 201) {
      this.bookingForm.student_email.value = form.email.value;
      form.reset();
      this.bookingForm.dispatchEvent(new Event('submit'), { cancelable: true })
      form.style.display = 'none'
    }
  }

  async handleBooking(event) {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    let json = JSON.stringify(Object.fromEntries(formData.entries()))
    console.log(json)

    let response = await fetch(form.action, {
      method: form.method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: json
    })

    if (response.status === 204) {
      alert('Booked');
      form.reset()
    } else if (response.status === 404) {
      let body = await response.text();
      alert(body);
      let sequence = body.split(':')[1].trim();
      this.renderNewStudentForm({ email: form.student_email.value, booking_sequence: sequence })
    }
  }

  async main() {
    await Promise.all([
      this.fetchStaff(),
      this.fetchAvailableSchedules(),
    ])
    this.renderAvailableSchedules();
  }
}

class ViewBookingsUI {
  constructor() {
    this.bookingList = document.querySelector('#bookings')
    this.bookings = null;
    this.main();

    this.bookingList.addEventListener('click', event => this.handleBookingDetails(event))
  }
  renderBookings() {
    let dates = this.bookings.map(date => (
      `<li name=${date} value=${date}>${date}</li>`
    )).join('');

    this.bookingList.innerHTML = dates
  }

  async handleBookingDetails(event) {
    if (event.target.tagName !== 'LI') return;
    if(!event.target.hasAttribute('value')) return;
    if(event.target.children.length > 0) {
      event.target.querySelector('ul').remove();
      return;
    }

    let dateItem = event.target;
    let date = dateItem.getAttribute('value');

    let response = await fetch(`/api/bookings/${date}`)
    let data = await response.json();

    let detailsHTML = data.map(([name, email, time]) =>
      `<li>${name} | ${email} | ${time}</li>`
    ).join('')

    dateItem.insertAdjacentHTML('beforeend', `<ul>${detailsHTML}</ul>`)
  }


  async fetchAllBookings() {
    let response = await fetch('/api/bookings')
    let data = await response.json();
    console.log(data)
    this.bookings = data;
  }

  async main() {
    await this.fetchAllBookings()
    this.renderBookings();
  }

}
// schedules cannot be cancelled if a booking has already been created for it

class CancellationsUI{
  constructor(){
    this.bookingForm = document.querySelector('#cancel_booking')
    this.scheduleForm = document.querySelector('#cancel_schedule')

    this.bookingForm.addEventListener('submit', event => this.handleBookingCancellation(event))
    this.scheduleForm.addEventListener('submit', event => this.handleScheduleCancellation(event))
  }

  async handleBookingCancellation(event) {
    event.preventDefault();
    let form = event.target;
    let bookingId = form.querySelector('#booking_id').value;

    let response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
      method: 'PUT',
    })

    if (response.status === 204) {
      alert('Booking cancelled')
      form.reset();
    } else if (response.status === 404) {
      let body = await response.text();
      alert(body)
    }

  }

  async handleScheduleCancellation(event) {
    event.preventDefault();

    let form = event.target;
    let scheduleId = form.querySelector('#schedule_id').value;

    let response = await fetch(`/api/schedules/${encodeURIComponent(scheduleId)}`, {
      method: 'DELETE',
    })

    if (response.status === 204) {
      alert('Schedule cancelled')
      form.reset();
    } else {
      let body = await response.text();
      alert(body)
    }

  }


}


document.addEventListener('DOMContentLoaded', () => {
  new CancellationsUI();
})