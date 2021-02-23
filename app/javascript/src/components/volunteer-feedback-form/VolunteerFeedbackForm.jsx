import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './VolunteerFeedbackForm.scss'
import Select from 'react-select'

const VolunteerFeedbackForm = () => {
  const category_options = [
    { label: 'Please, select one option', value: null },
    { label: "New BoxRequest form", value: "New BoxRequest form"},
    { label: "BoxRequest Review phase", value: "BoxRequest Review phase"},
    { label: "Box Design phase", value: "Box Design phase"},
    { label: "BoxItem Research phase", value: "BoxItem Research phase"},
    { label: "Box Assembly phase", value: "Box Assembly phase"},
    { label: "Box Shipment phase", value: "Box Shipment phase"},
    { label: "Box Followup phase", value: "Box Followup phase"},
    { label: "Inventory Management", value: "Inventory Management"},
    { label: "Attendance/Meeting Management", value: "Attendance/Meeting Management"},
  ]
  const [category, setCategory] = useState(null)
  const [description, setDescription] = useState('')
  const [sendingData, setSendingData] = useState(false)
  const [requestErrors, setRequestErrors] = useState(null)

  const handleSelectChange = (selected, _action) => {
    setCategory(selected.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const token = document.getElementsByName('csrf-token')[0].content
    const url = `${location.origin}/feedbacks/volunteers`
    setSendingData(true)

    let params = {
      feedback: {
        description: description,
        category: category
      }
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': token
      }
    }).then((response) => {
      if( !response.ok ) { 
        throw response 
      } else {
        return response.json();
      }
    }).then(successMessage => {
      console.log(successMessage);

    }).catch((error) => {
      error.json().then( errMessages => {
        setRequestErrors(errMessages)
        console.log({...errMessages, status: error.status})
      })
    }).finally( setSendingData(false) )

    
  }

  return(
    <main className='volunteer-feedback'>
      <section>
        <div className="form-info">Thank you for providing your feedback to Voices of Consent</div>
        <div className="errors"> { requestErrors != null && 'test' } </div>
      <hr/>
      <form onSubmit={handleFormSubmit} className='volunteer-feedback__form'>
        <div className="row form-item">
          <div className="col-12">
            <label htmlFor="Cateogry">Category</label>
            <Select
              name='category'
              value={ category }
              placeholder={ category_options.find( (option) => option.value == category ).label }
              onChange={handleSelectChange}
              options={category_options}/>
          </div>
        </div>

        <div className='row form-item'>
          <div className='col-12'>
            <label htmlFor="Cateogry">Description</label>
            <textarea 
              className='feedback-description'
              name='description'
              onChange={handleDescriptionChange}
              defaultValue={description}></textarea>
          </div>
        </div>

        <div className='row form-item'>
          <div className='col-md-6'>
            <button
              className='btn btn-secondary btn-lg'
              type='reset'
            >Clear</button>
          </div>

          <div className='col-md-6'>
            <button
              className='btn btn-primary btn-lg float-right'
              type='submit'
              disabled={ sendingData }
            >{ sendingData ? '...' : 'Submit' } </button>
          </div>
        </div>
      </form>
      </section>
    </main>
  )
}

export default VolunteerFeedbackForm;