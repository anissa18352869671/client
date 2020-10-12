const state = {
    activeIndex: "",
}

const mutations = {
    editactiveIndex(state, activeIndex) {
        state.activeIndex = activeIndex
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