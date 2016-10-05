/**
 * Created by watcher on 10/5/16.
 */
import React from 'react'
import './style.css'

class Pagination extends React.Component {
    render () {
        let arrayNums = [],
            num = this.props.num
        for (; arrayNums.length <= num;) {
            arrayNums.push({})
        }
        return (
            <ul className='pagination'>
                {arrayNums.map((num, i) => {
                    if(i > 0) {
                        return (
                            <li key={Math.random()} onClick={() => this.props.handlerPagination(i)}><a className='href-pagination'>{i}</a></li>
                        )
                    }
                })}
            </ul>
        )
    }
}

export default Pagination