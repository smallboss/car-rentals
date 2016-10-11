/**
 * Created by watcher on 10/7/16.
 */

export function searcher (arrTarget, arrProps, searchValue) {
    let result = []
    arrProps.forEach(prop => {
        arrTarget.map(item => {
            for(let i = 0; i < result.length; i++) {
                if(result[i]._id == item._id) {
                    return
                }
            }
            for(let _prop in item) {
                if(prop == _prop) {
                    if(typeof item[_prop] == 'string') {
                        if(item[_prop].toLowerCase().indexOf(searchValue) != -1) {
                            result.push(item)
                            break
                        }
                    } else if (typeof item[_prop] == 'object') {
                        for (let __prop in item[_prop]) {
                            if(typeof item[_prop][__prop] == 'string') {
                                if(item[_prop][__prop].toLowerCase().indexOf(searchValue) != -1) {
                                    result.push(item)
                                    break
                                }
                            } else if(typeof item[_prop][__prop] == 'object') {
                                for (let ___prop in item[_prop][__prop]) {
                                    if(typeof item[_prop][__prop][___prop] == 'string') {
                                        if(item[_prop][__prop][___prop].toLowerCase().indexOf(searchValue) != -1) {
                                            result.push(item)
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    })
    return result
}
