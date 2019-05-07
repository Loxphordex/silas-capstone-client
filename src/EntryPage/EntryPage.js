import React from 'react'
import './EntryPage.css'
import TokenService from '../services/token-service'
import ApiService from '../services/api-service'
import UserEntryList from '../UserEntryList/UserEntryList'

export default class EntryPage extends React.Component {

  handleLogout() {
    TokenService.clearAuthToken()
    this.props.clearError()
    this.props.history.history.push('/')
  }

  handleSaveEntry = (event) => {
    event.preventDefault()
    const entry = event.target.entryText.value

    console.log(entry)

    // Send the entry to the server
    ApiService.postEntry(entry)
      .catch(err => this.props.handleError(err))
  }

  render() {
    return (
      <div className='entry-page'>
        <div className="main-wrap">

            <input id="slide-sidebar" type="checkbox" checked='false' role="button" />
                <label htmlFor="slide-sidebar"><span>&#9776;</span></label>
            <div className="sidebar">
              <h2>My Journals</h2>
              <UserEntryList 
                userEntries={this.props.userEntries}
                updateUserEntries={this.props.updateUserEntries}
              />
              <button id='logout' onClick={() => this.handleLogout()}>Logout</button>
            </div>

            <div className="portfolio">
              <header role='heading'>
                <h1>Quoter</h1>
              </header>

              <section id='quotes-area'>
                <div className='quotebox'>
                  <p className='quote-paragraph'>{
                    this.props.quotes.length > 0 &&
                    this.props.quotes[this.props.quotes.length - 1].quote
                  }</p>
                  <div className='quote-author'>{
                    this.props.quotes.length > 0 &&
                    '- ' + this.props.quotes[this.props.quotes.length - 1].author
                  }</div>
                </div>
              </section>

              <section id='entry-area'>
                <form id='entry_form' onSubmit={(event) => this.handleSaveEntry(event)}>
                  <textarea id='entryText' name='entryText' onChange={(event) => this.props.updateEntry(event.target.value)}></textarea>
                  <button type='submit' id='save-button'>Save</button>
                </form>  
              </section>            
            </div>
        </div>        
      </div>
    )
  }
}