const state = {
    homeHeader: ""
}

const mutations = {
    edit(state,homeHeader) {
        state.homeHeader = homeHeader
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