const state = {
    tools_no: ""
}

const mutations = {
    edit_tools_no(state, tools_no) {
        state.tools_no = tools_no
    }
}

const actions = {
    someAsyncTask({
        commit
    }) {
        // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

export default {
    state,
    mutations,
    actions
}