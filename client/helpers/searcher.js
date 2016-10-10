/**
 * Created by watcher on 10/7/16.
 */

export function searcher (arrTarget, arrProps, searchValue) {
    let result = []
    arrProps.forEach(prop => {
        arrTarget.map(item => {
            for(let _prop in item) {
                if(prop == _prop) {
                    if(typeof item[_prop] == 'string') {
                        if(item[_prop].toLowerCase().indexOf(searchValue) != -1) {
                            result.push(item)
                            break
                        }
                    } else if (typeof item[_prop] == 'object') {
                        for (let __prop in item[_prop]) {
                            if(typeof item[__prop] == 'string') {
                                if(item[__prop].toLowerCase().indexOf(searchValue) != -1) {
                                    result.push(item)
                                    break
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
