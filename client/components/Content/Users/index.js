/**
 * Created by watcher on 10/12/16.
 */
import React from 'react'
import { browserHistory } from 'react-router'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import UserForTable from './UserForTable'
import Pagination from '../Customers/Pagination'
import { searcher } from '../../../helpers/searcher'

class Users extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: this.props.users,
            currentPage: 1,
            elemsOnPage: 3,
            maxPage: 0,
            stateForRemove: []
        }
        this.handlerPagination = this.handlerPagination.bind(this)
        this.handlerDeleteUser = this.handlerDeleteUser.bind(this)
        this.handlerSearchUser = this.handlerSearchUser.bind(this)
    }
    componentWillMount () {
        let maxPage = Math.ceil(this.props.users.length / this.state.elemsOnPage)
        this.setState({users: this.props.users, maxPage})
    }
    componentWillReceiveProps(nextProps) {
        let _users = nextProps.users
        let maxPage = Math.ceil(_users.length / this.state.elemsOnPage)
        this.setState({users: _users, maxPage})
    }
    shouldComponentUpdate (nextProps, nextState) {
        let _check = (nextState.stateForRemove.length > 0 ) ? 0 : 1
        return _check
    }
    handlerPagination (num) {
        this.setState({currentPage: num})
    }
    handlerDeleteUser (e) {
        let arrForRemove = this.state.stateForRemove,
            { id, name } = e.target
        switch (name) {
            case 'checkbox-for-delete':
                if($(e.target).is(':checked')){
                    arrForRemove.push(id)
                } else {
                    arrForRemove = arrForRemove.filter(elem => {
                        if (elem != id) {
                            return elem
                        }
                    })
                }
                this.setState({stateForRemove: arrForRemove})
                break
            case 'remover-users':
                arrForRemove.map(elem => {
                    Meteor.users.remove({_id: elem})
                })
                location.reload()
                break
            default: break
        }
    }
    handlerSearchUser (e) {
        let searchValue = e.target.value.toLowerCase(),
            stateFromValue = [],
            _props = this.props.users
        if(searchValue.length > 0) {
            let arrToFind = ['username', 'emails', 'profile']
            stateFromValue = searcher(_props, arrToFind, searchValue)
        } else {
            stateFromValue = this.props.users
        }
        let maxPage = Math.ceil(stateFromValue.length / this.state.elemsOnPage)
        this.setState({users: stateFromValue, maxPage})
    }
    render () {
        let currentNums = this.state.currentPage * this.state.elemsOnPage
        let _users = this.state.users.slice(currentNums - this.state.elemsOnPage, currentNums)
        return (
            <div>
                <h3>User`s list</h3>
                <div className='col-xs-9'></div>
                <div className='col-xs-3'>
                    <input type='search' className='form-control' placeholder='Search' onChange={this.handlerSearchUser} />
                </div>
                <table className='table table-hover'>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>User name</th>
                        <th>Name</th>
                        <th>User email</th>
                        <th>User phone</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_users.map(user => {
                        return (
                            <UserForTable user_data={user} handlerDeleteUser={this.handlerDeleteUser} key={Math.random()} />
                        )
                    })}
                    </tbody>
                </table>
                <input type='button' className='btn btn-danger' name='remover-users' value='Delete users' onClick={this.handlerDeleteUser} />
                <input type='button' className='btn btn-success m-x-1' name='add-user' value='Add user' onClick={() => {let _new = 'new'; browserHistory.push(`/managePanel/customer/${_new}`)}} />
                {(this.state.maxPage > 1) ? <div className='text-center'>
                    <Pagination num={this.state.maxPage} handlerPagination={this.handlerPagination} key={Math.random()} />
                </div> : ''}
            </div>
        )
    }
}

export default createContainer (() => {
    Meteor.subscribe('users')
    return {
        users: Meteor.users.find({}).fetch()
    }
}, Users)