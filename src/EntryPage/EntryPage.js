import React from 'react'
import './EntryPage.css'
import './EntryPageFullScreen.css'
import { Link } from 'react-router-dom'
import TokenService from '../services/token-service'
import ApiService from '../services/api-service'
import UserEntryList from '../UserEntryList/UserEntryList'
import Nav from '../Nav/Nav'

export default class EntryPage extends React.Component {

  handleLogout() {
    TokenService.clearAuthToken()
    this.props.resetState()
    this.props.clearError()
    this.props.history.history.push('/')
  }

  handleSaveEntry = (event) => {
    event.preventDefault()
    const content = event.target.entryText.value
    const title = event.target.title.value

    const entry = { title, content }

    // Send the entry to the server
    if(TokenService.getAuthToken()) {
      this.props.toggleSave()
      ApiService.postEntry(entry)
        .then(() => {
          ApiService.getUserEntries()
          .then(entries => {
            this.props.toggleSave()
            this.props.updateUserEntries(entries)
          })
          .catch(err => this.props.handleError(err))        
        })
        .catch(err => this.props.handleError(err))
    }
  }

  handleGetEntry = (entryId) => {
    ApiService.getEntryById(entryId)
      .then(entry => {
        this.props.updateEntry(entry.content)
        this.props.updateTitle(entry.title)
      })
  }

  render() {
    let toggle = this.props.saveToggle
    console.log(toggle)
    return (
      <div className='entry-page'>
        <div className="main-wrap">

            <input id="slide-sidebar" type="checkbox" defaultChecked='true' role="button" />
                <label htmlFor="slide-sidebar"><span>&#9776;</span></label>
            <div className="sidebar">
              <h2>My Journals</h2>
              <UserEntryList 
                userEntries={this.props.userEntries}
                updateUserEntries={this.props.updateUserEntries}
                updateEntry={this.props.updateEntry}
                updateTitle={this.props.updateTitle}
                handleGetEntry={this.handleGetEntry}
              />
              {!TokenService.getAuthToken() && 
              <div className='sidebar-signup-info'>
                <p>Sign up to save your entries. It's free!</p>
                <Link to='/register'>Sign Up</Link>
                <Link to='/login'>Login</Link>
              </div>}
              {TokenService.getAuthToken() && <button className='logout' onClick={() => this.handleLogout()}>Logout</button>}
            </div>

            <div className="portfolio">
              <nav>
                <Nav history={this.props.history} />
              </nav>

              <div className='portfolio-main'>
              <section className='quotes-area'>
                <div className='big-Q'>Q</div>
                <div className='quotebox'>
                  <p className='quote-paragraph'>{
                    this.props.quotes && this.props.quotes.length > 0 &&
                    this.props.quotes[this.props.quotes.length - 1].quote
                  }</p>
                  <div className='quote-author'>
                  
                  {
                    this.props.quotes && this.props.quotes.length > 0 && 
                    !this.props.quotes[this.props.quotes.length - 1].author &&
                    '- Unknown Author'
                  }
                  
                  {
                    this.props.quotes && this.props.quotes.length > 0 &&
                    !!this.props.quotes[this.props.quotes.length - 1].author &&
                    '- ' + this.props.quotes[this.props.quotes.length - 1].author
                  }

                  </div>
                </div>
              </section>

              <section className='entry-area'>
                <form className='entry_form' onSubmit={(event) => this.handleSaveEntry(event)}>
                  <input 
                    id='title' 
                    name='title' 
                    defaultValue={this.props.currentTitle}
                    placeholder='Title'></input>
                  <textarea 
                    placeholder='Type anything...'
                    id='entryText' 
                    name='entryText' 
                    value={this.props.currentEntry}
                    onChange={(event) => this.props.updateEntry(event.target.value)}>
                  </textarea>
                  <button type='submit' className='save_button' disabled={!toggle}>Save</button>
                </form>  
              </section>            
              </div>
            </div>
        </div>        
      </div>
    )
  }
}