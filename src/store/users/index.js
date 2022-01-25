const state = () => {
  return {
    user: {
      email: null,
      userId: null,
      userData: {}
    },
    categoryIcons: [
      { name: 'handyman', tags: [] },
      { name: 'alternate_email', tags: [] },
      { name: 'star_border', tags: [] },
      { name: 'add', tags: [] },
      { name: 'remove', tags: [] },
      { name: 'tag', tags: [] },
      { name: 'format_quote', tags: [] },
      { name: 'question_mark', tags: [] },
      { name: 'priority_high', tags: [] },
      { name: 'sports_bar', tags: [] },
      { name: 'business', tags: [] },
      { name: 'watch_later', tags: [] },
      { name: 'attach_money', tags: [] },
      { name: 'euro', tags: [] },
      { name: 'child_friendly', tags: [] },
      { name: 'description', tags: [] },
      { name: 'emoji_events', tags: [] },
      { name: 'people', tags: [] },
      { name: 'restaurant', tags: [] },
      { name: 'female', tags: [] },
      { name: 'pets', tags: [] },
      { name: 'home', tags: [] },
      { name: 'lock', tags: [] },
      { name: 'psychology', tags: [] },
      { name: 'palette', tags: [] },
      { name: 'language', tags: [] },
      { name: 'engineering', tags: [] },
      { name: 'auto_stories', tags: [] },
      { name: 'thermostat', tags: [] },
      { name: 'shower', tags: [] },
      { name: 'bolt', tags: [] },
      { name: 'request_quote', tags: [] },
      { name: 'computer', tags: [] },
      { name: 'savings', tags: [] },
      { name: 'kitchen', tags: [] },
      { name: 'favorite_border', tags: [] },
      { name: 'groups', tags: [] },
      { name: 'medical_services', tags: [] },
      { name: 'location_on', tags: [] },
      { name: 'public', tags: [] },
      { name: 'male', tags: [] },
      { name: 'headphones', tags: [] },
      { name: 'music_note', tags: [] },
      { name: 'explore', tags: [] },
      { name: 'liquor', tags: [] },
      { name: 'settings', tags: [] },
      { name: 'receipt_long', tags: [] },
      { name: 'checkroom', tags: [] },
      { name: 'bed', tags: [] },
      { name: 'card_giftcard', tags: [] },
      { name: 'local_mall', tags: [] },
      { name: 'local_grocery_store', tags: [] },
      { name: 'email', tags: [] },
      { name: 'report_problem', tags: [] },
      { name: 'flight', tags: [] },
      { name: 'work', tags: [] },
      { name: 'attractions', tags: [] },
      { name: 'local_florist', tags: [] },
      { name: 'cell_tower', tags: [] },
      { name: 'fitness_center', tags: [] },
      { name: 'phone', tags: [] },
      { name: 'smartphone', tags: [] },
      { name: 'electrical_services', tags: [] },
      { name: 'directions_car', tags: [] },
      { name: 'pedal_bike', tags: [] },
      { name: 'directions_bus', tags: [] },
      { name: 'clean_hands', tags: [] },
      { name: 'face_retouching_natural', tags: [] },
      { name: 'school', tags: [] },
      { name: 'theaters', tags: [] },
      { name: 'brush', tags: [] },
      { name: 'luggage', tags: [] },
      { name: 'gpp_good', tags: [] },
      { name: 'abc', tags: [] },
      { name: 'title', tags: [] },
      { name: 'currency_pound', tags: [] },
      { name: 'currency_bitcoin', tags: [] },
      { name: 'currency_ruble', tags: [] },
      { name: 'scale', tags: [] },
      { name: 'visibility', tags: [] },
      { name: 'poll', tags: [] },
      { name: 'show_chart', tags: [] },
      { name: 'smart_toy', tags: [] },
      { name: 'info', tags: [] },
      { name: 'today', tags: [] },
      { name: 'icecream', tags: [] },
      { name: 'image', tags: [] },
      { name: 'photo_camera', tags: [] },
      { name: 'vpn_key', tags: [] },
      { name: 'museum', tags: [] },
      { name: 'face', tags: [] },
      { name: 'extension', tags: [] },
      { name: 'newspaper', tags: [] },
      { name: 'nightlight', tags: [] },
      { name: 'cloud', tags: [] },
      { name: 'landscape', tags: [] },
      { name: 'cake', tags: [] },
      { name: 'park', tags: [] },
      { name: 'event_note', tags: [] },
      { name: 'send', tags: [] },
      { name: 'local_police', tags: [] },
      { name: 'health_and_safety', tags: [] },
      { name: 'format_paint', tags: [] },
      { name: 'desktop_windows', tags: [] },
      { name: 'notifications', tags: [] },
      { name: 'edit', tags: [] },
      { name: 'sentiment_very_satisfied', tags: [] },
      { name: 'language', tags: [] },
      { name: 'translate', tags: [] },
      { name: 'architecture', tags: [] },
      { name: '3d_rotation', tags: [] },
      { name: 'view_in_ar', tags: [] },
      { name: 'battery_charging_full', tags: [] },
      { name: 'bluetooth', tags: [] },
      { name: 'wifi', tags: [] },
      { name: 'bathtub', tags: [] },
      { name: 'door_front', tags: [] },
      { name: 'file_download', tags: [] },
      { name: 'gavel', tags: [] },
      { name: 'format_list_bulleted', tags: [] },
      { name: 'delete', tags: [] },
      { name: 'science', tags: [] },
      { name: 'send', tags: [] },
      { name: 'pause', tags: [] },
      { name: 'search', tags: [] },
      { name: 'local_cafe', tags: [] },
      { name: 'print', tags: [] },
      { name: 'javascript', tags: [] },
      { name: 'css', tags: [] },
      { name: 'html', tags: [] },
      { name: 'percent', tags: [] },
      { name: 'question_answer', tags: [] },
      { name: 'file_upload', tags: [] },
      { name: 'play_arrow', tags: [] },
      { name: 'stop', tags: [] },
      { name: 'light_mode', tags: [] },
      { name: 'flag', tags: [] },
      { name: '123', tags: [] },
      { name: 'lightbulb', tags: [] },
      { name: 'android', tags: [] },
      { name: 'smoking_rooms', tags: [] },
      { name: 'push_pin', tags: [] },
      { name: 'umbrella', tags: [] }
    ]
  }
}

const mutations = {
  SET_USER(state, user) {
    state.user.userId = user.userId
    state.user.email = user.email
  },
  SET_USER_DATA(state, userData) {
    state.user.userData = userData
  },
  LOGOUT(state) {
    state.user.email = null
    state.user.userId = null
    state.user.userData = {}

    this.$router.push('/auth')
  }
}

const actions = {
  setUser({ commit }, user) {
    commit('SET_USER', user)
  },
  setUserData({ commit }, userData) {
    commit('SET_USER_DATA', userData)
  },
  logout({ commit }) {
    commit('LOGOUT')
  }
}

const getters = {
  email: (state) => state.user.email,
  userId: (state) => state.user.userId,
  userData: (state) => state.user.userData,
  categoryIcons: (state) => state.categoryIcons,
  tasks: (state) => state.user?.userData?.tasks || {},
  freeTasks: (state) => state.user?.userData?.freeTasks || {},
  notes: (state) => state.user?.userData?.notes || {},
  processes: (state) => state.user?.userData?.processes || {}
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
