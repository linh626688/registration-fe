import React, {Component} from 'react';
import './styles.css';
import {Col, Container, Input, Row, Button, Alert} from "reactstrap";
import UserServices from "../services";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      months: this.generateMonth(),
      days: this.generateDay(),
      years: YEARS,
      textErr: '',
      textSuccess: '',
      isSuccess: false,
      form: {
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        monthOfBirth: '',
        yearOfBirth: '',
      }
    }
  }

  componentDidMount() {
    this.generateMonth();
    this.generateDay();

  }

  generateMonth = () => {
    let months = []
    for (let i = 1; i <= 12; i++) {
      months.push({value: i, label: i})
    }
    return months
  }
  generateDay = () => {
    let days = []
    for (let i = 1; i <= 31; i++) {
      days.push({value: i, label: i, disable: false})
    }
    return days
  }

  onChangeText = event => {
    const {value, name} = event.target
    const {form} = this.state
    form[name] = value;
    this.setState({form});
  }

  validateEmail = email => {
    var re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
    return re.test(String(email).toLowerCase());
  }

  validatePhoneNumber = phoneNumber => {
    var re = /(09|01[2|6|8|9])+([0-9]{8})\b/g;
    return re.test(String(phoneNumber).toLowerCase());
  }

  validateBeforeSubmit = () => {
    const {form} = this.state
    if (form.mobileNumber === '') {
      this.setState({textErr: 'Mobile number is required.'});
      return false
    } else if (!this.validatePhoneNumber(form.mobileNumber)) {
      this.setState({textErr: 'Please enter valid Vietnamese number'});
      return false
    }
    if (form.firstName === '') {
      this.setState({textErr: 'First name is required.'});
      return false
    }
    if (form.lastName === '') {
      this.setState({textErr: 'Last name is required.'});
      return false
    }
    if (form.email === '') {
      this.setState({textErr: 'Email number is required.'});
      return false
    } else if (!this.validateEmail(form.email)) {
      this.setState({textErr: 'Please enter valid Email'});
      return false
    }
    this.setState({textErr: ''});
    return true
  }

  onChangeDate = event => {
    const {value, name} = event.target
    const {form} = this.state
    let {days} = this.state
// eslint-disable-next-line default-case
    switch (name) {
      case "month" :
        days = this.getDaysArray(days, value, form.yearOfBirth)
        form.monthOfBirth = value
        form.dateOfBirth = ''
        break
      case "date":
        form.dateOfBirth = value
        break
      case "year":
        form.yearOfBirth = value
        form.dateOfBirth = ''
        days = this.getDaysArray(days, form.monthOfBirth, value)
        break
    }
    this.setState({form, days});
  }

  isLeapYear = year => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0);
  }

  getDaysArray = (days, month, year) => {
    if ([4, 6, 10, 11].includes(parseInt(month))) {
      days[30].disable = true
    } else if ([2].includes(parseInt(month))) {
      days[30].disable = true
      days[29].disable = true
      days[28].disable = true
      if (year && this.isLeapYear(parseInt(year))) {
        days[28].disable = false
      }
    } else {
      days = this.generateDay();
    }
    return days
  }

  convertNumberToString = (number) => {
    if (number >= 1 && number <= 9) {
      return `0${number}`
    }
    return `${number}`
  }

  onClickRegister = () => {
    const {form} = this.state
    if (this.validateBeforeSubmit()) {
      let payload
      payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.mobileNumber,
        gender: form.gender ? form.gender : null,
        email: form.email,
        dateOfBirth: (form.dateOfBirth && form.monthOfBirth && form.yearOfBirth) ? `${form.yearOfBirth}-${this.convertNumberToString(form.monthOfBirth)}-${this.convertNumberToString(form.dateOfBirth)}` : null,
      }
      UserServices.doRegister(payload)
        .then(response => {
          if (response.data.header.success) {
            this.setState({textSuccess: "Register Success", isSuccess: true});
            setTimeout(() => {
              this.setState({textSuccess: ""});
            }, 2000)
          } else {
            let error = response.data.body.errors[0].errorCode
            switch (error) {
              case EXCEPTION.EMAIL_IS_EXITS:
                this.setState({textErr: "Email has been used"});
                break
              case EXCEPTION.PHONE_NUMBER_IS_EXITS:
                this.setState({textErr: "Phone number has been used"});
                break
              default:
                break
            }
          }
        }).catch(err => {
        console.log(`err`, err)
      })
    }
  }

  onClickLogin = () => {
    this.props.history.push('/login')
  }

  render() {
    const {days, months, years, form, textErr, textSuccess, isSuccess} = this.state
    return (
      <div>
        <div className="back-ground">
          <Container>
            <Row className={isSuccess ? "disable-div" : ''}>
              <Col xs="6">
                <Row>
                  <Col xs="4" className="p-0">
                    <h2>Registration</h2>
                  </Col>
                  {textErr && <Col xs="8">
                    <Alert color="danger">
                      {textErr}
                    </Alert>
                  </Col>}
                  {textSuccess && <Col xs="8">
                    <Alert color="success">
                      {textSuccess}
                    </Alert>
                  </Col>}
                </Row>
                <Row>
                  <Input onChange={this.onChangeText} name="mobileNumber" placeholder="Mobile number"/>
                </Row>
                <Row>
                  <Input onChange={this.onChangeText} name="firstName" placeholder="First name"/>
                </Row>
                <Row>
                  <Input onChange={this.onChangeText} name="lastName" placeholder="Last name"/>
                </Row>
                <Row>

                  <Col xs="2" className="p-0 mr-1">
                    <Input type="select" name="month" id="month" onChange={this.onChangeDate}
                           value={form.monthOfBirth}>
                      <option value="" defaultChecked>Month</option>
                      {months.map(item => {
                        return <option value={item.value} key={item.value}>{item.label}</option>
                      })}
                    </Input>
                  </Col>
                  <Col xs="2" className="p-0 mr-1">
                    <Input type="select" name="date" id="date" onChange={this.onChangeDate} value={form.dateOfBirth}>
                      <option defaultChecked>Date</option>
                      {days.map(item => {
                        return <option value={item.value} key={item.value}
                                       disabled={item.disable}>{item.label}</option>
                      })}
                    </Input>
                  </Col>
                  <Col xs="2" className="p-0">
                    <Input type="select" name="year" id="year" onChange={this.onChangeDate} value={form.yearOfBirth}>
                      <option defaultChecked>Year</option>
                      {years.map(item => {
                        return <option value={item.value} key={item.value}>{item.label}</option>
                      })}
                    </Input>
                  </Col>
                </Row>
                <Row>
                  <Col xs="2" className="ml-1">
                    <Input type="radio" value={GENDER.MALE} name="gender" checked={form.gender === GENDER.MALE}
                           onChange={this.onChangeText}/> Male </Col>
                  <Col xs="2">
                    <Input type="radio" value={GENDER.FEMALE} name="gender" checked={form.gender === GENDER.FEMALE}
                           onChange={this.onChangeText}/> Female </Col>
                </Row>
                <Row>
                  <Input onChange={this.onChangeText} name="email" placeholder="Email"/>
                </Row>
                <Row>
                  <Button className="w-100 bg-btn" onClick={this.onClickRegister}> Register</Button>
                </Row>
              </Col>
            </Row>
            <Row className="pt-2">
              <Col xs="6">
                {isSuccess && <Row>
                  <Button className="w-100 bg-btn" onClick={this.onClickLogin}> Login</Button>
                </Row>}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}
//#9c27b0
const YEARS = [
  {value: 1995, label: 1995},
  {value: 1996, label: 1996},
  {value: 1997, label: 1997},
  {value: 1998, label: 1998},
  {value: 1999, label: 1999},
  {value: 2000, label: 2000},
  {value: 2001, label: 2001},
  {value: 2002, label: 2002},
  {value: 2003, label: 2003},
  {value: 2004, label: 2004},
  {value: 2005, label: 2005},
  {value: 2006, label: 2006},
  {value: 2007, label: 2007},
  {value: 2008, label: 2008},
  {value: 2009, label: 2009},
  {value: 2010, label: 2010},
  {value: 2011, label: 2011},
  {value: 2012, label: 2012},
  {value: 2013, label: 2013},
  {value: 2014, label: 2014},
  {value: 2015, label: 2015},
];
const GENDER = {MALE: 'MALE', FEMALE: 'FEMALE'}
const EXCEPTION = {EMAIL_IS_EXITS: 'EMAIL_IS_EXITS', PHONE_NUMBER_IS_EXITS: 'PHONE_NUMBER_IS_EXITS'}

export default Register;


