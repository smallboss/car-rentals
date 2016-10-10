import React, { Component } from 'react';
import Customers from './Customers';

export default class IndexFile extends Component {
    componentDidMount () {
        [...document.getElementsByClassName('make-action')].forEach((button) => {
            button.addEventListener('click', (e) => {
                let _target = $('#' + e.target.id).attr('data-target')
                $('#' + _target).toggle()
            })
        })
    }
    render() {
        return (
          <Customers />
        )
    }
}
