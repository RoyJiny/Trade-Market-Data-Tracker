export const saveTitle = (title) => (dispatch) => {
    dispatch({type: 'save_title', payload: title});
};