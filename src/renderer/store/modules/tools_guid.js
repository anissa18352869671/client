const state = {
    tools_guid: ""
}

const mutations = {
    edit_tools_guid(state, tools_guid) {
        state.tools_guid = tools_guid
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