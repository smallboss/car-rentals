/**
 * Created by watcher on 10/15/16.
 */
import React from 'react'

class Home extends React.Component {
    handlerContact (e) {
        e.preventDefault()
    }
    render () {
        return (
            <div className='m-x-3'>
                <div className='row main-row-home'>

                </div>
                <div id='services' className='row services-row m-y-1 text-center'>
                    <h4>Services</h4>
                    <div className='col-xs-2'></div>
                    <div className='col-xs-3'>
                        <div className='services-div'></div>
                    </div>
                    <div className='col-xs-3'>
                        <div className='services-div'></div>
                    </div>
                    <div className='col-xs-3'>
                        <div className='services-div'></div>
                    </div>
                    <div className='col-xs-1'></div>
                </div>
                <div id='reviews' className='row reviews-row p-a-1 text-center'>
                    <h4>Reviews</h4>
                    <div className='col-xs-1'></div>
                    <div className='col-xs-10 reviews-text'>
                        It is always a positive experience when renting from your 5th street location.<br />
                        The staff is very professional and efficient and always smiling.<br />
                        And I always feel welcome and appreciated.<br />
                        The management is always prompt to solve any issue at any moment.<br />
                        Their efficiency and professionalism makes it my number one choice.<br /><br />
                        - Jhon Doe, Las Vegas NV
                    </div>
                    <div className='col-xs-1'></div>
                </div>
                <div id='location' className='row location-row m-y-1'>
                    <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13229.167119057834!2d-118.4901919318296!3d34.01072062736382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bb2a3112a9ff%3A0x34b8d7467cc3ca5d!2zMjEwMiBMaW5jb2xuIEJsdmQsIFNhbnRhIE1vbmljYSwgQ0EgOTA0MDUsINCh0KjQkA!5e0!3m2!1sru!2sru!4v1476611642327' width='100%' height='450' frameBorder='0' style={{border: '0'}} allowFullScreen></iframe>
                </div>
                <div id='contact' className='row contact-row text-center'>
                    <h4>Contact</h4>
                    <div className='col-xs-1'></div>
                    <div className='col-xs-10'>
                        <form className='form-horizontal' onSubmit={this.handlerContact}>
                            <div className='form-group'>
                                <div className='col-xs-6'>
                                    <input type='text' className='form-control' name='firstName' placeholder='First Name' />
                                </div>
                                <div className='col-xs-6'>
                                    <input type='text' className='form-control' name='lastName' placeholder='Last Name' />
                                </div>
                            </div>
                            <div className='form-group m-y-1'>
                                <div className='col-xs-6'>
                                    <input type='text' className='form-control' name='phone' placeholder='Telephone' />
                                </div>
                                <div className='col-xs-6'>
                                    <input type='email' className='form-control' name='email' placeholder='Email' />
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className=' col-xs-12'>
                                    <textarea className='form-control' name='textContact' placeholder='Message' />
                                </div>                                
                            </div>
                            <input type='submit' className='btn btn-success pull-right' value='Send' />
                        </form>
                    </div>
                    <div className='col-xs-1'></div>
                </div>
            </div>
        )
    }
}

export default Home