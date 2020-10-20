export default function (state={title: 'crypto'}, action){
    switch(action.type){
        case 'save_title':
            return {title: action.payload}
        default:
            return state;
    }
}