const state = () => {
  return {
    categoryIcons: [
      { name: '', tags: [] },
      {
        name: 'handyman',
        tags: ['work', 'hobby', 'tools', 'instrument', 'job']
      },
      { name: 'alternate_email', tags: ['@', 'mail', 'e-mail', 'email'] },
      {
        name: 'star_border',
        tags: ['star', 'favorites', 'hotel', 'sky', 'night']
      },
      { name: 'add', tags: ['plus', '+', 'create'] },
      { name: 'remove', tags: ['delete', 'minus', '-'] },
      { name: 'tag', tags: ['hashtag', 'cell'] },
      { name: 'format_quote', tags: ['book', 'dialog', 'replica', 'text'] },
      { name: 'help_outline', tags: ['question_mark'] },
      {
        name: 'priority_high',
        tags: ['exclamation_mark', 'warning', 'danger', 'necessary']
      },
      {
        name: 'sports_bar',
        tags: [
          'drink',
          'party',
          'alcohol',
          'meeting',
          'holidays',
          'weekend',
          'beer'
        ]
      },
      { name: 'business', tags: ['building', 'office', 'work', 'job'] },
      { name: 'watch_later', tags: ['clock', 'time', 'plans', 'alarm'] },
      { name: 'attach_money', tags: ['finance', 'dollar', 'usd', 'cash', '$'] },
      { name: 'euro', tags: ['money', 'finance', '€', 'cash'] },
      { name: 'currency_pound', tags: ['money', 'finance', 'cash', '£'] },
      { name: 'currency_ruble', tags: ['money', 'finance', 'cash', '₽'] },
      { name: 'child_friendly', tags: ['kids', 'baby', 'family'] },
      { name: 'description', tags: ['note', 'bookmark', 'list', 'sheet'] },
      {
        name: 'emoji_events',
        tags: ['award', 'competition', 'prize', 'goal', 'reward']
      },
      { name: 'people', tags: ['friends', 'man', 'woman', 'family'] },
      { name: 'restaurant', tags: ['food', 'cafe', 'dishes', 'tableware'] },
      { name: 'pets', tags: ['animals', 'cat', 'dog', 'paw', 'toys'] },
      { name: 'home', tags: ['building', 'house', 'family', 'apartment'] },
      { name: 'lock', tags: ['secret', 'code', 'password'] },
      {
        name: 'psychology',
        tags: ['brain', 'science', 'intelligence', 'head']
      },
      {
        name: 'palette',
        tags: ['hobby', 'art', 'interests', 'free-time', 'creativity']
      },
      { name: 'language', tags: ['world', 'planet', 'internet'] },
      {
        name: 'engineering',
        tags: ['profession', 'job', 'work', 'specialization', 'occupation']
      },
      { name: 'auto_stories', tags: ['book', 'notes', 'recordings', 'diary'] },
      { name: 'thermostat', tags: ['hot', 'cold', 'temperature', 'weather'] },
      { name: 'shower', tags: ['bathroom', 'water', 'clean', 'care', 'bills'] },
      {
        name: 'bolt',
        tags: ['electricity', 'power', 'lightning', 'bills', 'devices']
      },
      { name: 'request_quote', tags: ['bills', 'finance', 'money'] },
      { name: 'computer', tags: ['electricity', 'pc', 'laptop', 'devices'] },
      { name: 'savings', tags: ['money', 'finance', 'cash', 'pig'] },
      { name: 'kitchen', tags: ['food', 'refrigerator', 'fridge', 'devices'] },
      {
        name: 'favorite_border',
        tags: ['heart', 'health', '<3', 'like', 'wish', 'medicine']
      },
      { name: 'groups', tags: ['people', 'family'] },
      {
        name: 'medical_services',
        tags: ['health', 'care', 'heart', 'hospital', 'doctor']
      },
      { name: 'location_on', tags: ['map', 'gps', 'place', 'point'] },
      {
        name: 'public',
        tags: ['earth', 'world', 'trip', 'vacation', 'journey']
      },
      { name: 'male', tags: ['human', 'person'] },
      { name: 'female', tags: ['human', 'person'] },
      { name: 'headphones', tags: ['music', 'songs', 'sounds'] },
      {
        name: 'music_note',
        tags: ['songs', 'sounds', 'playlist', 'artist', 'hobby', 'creativity']
      },
      {
        name: 'explore',
        tags: [
          'compass',
          'survival',
          'way',
          'location',
          'map',
          'trip',
          'journey'
        ]
      },
      {
        name: 'liquor',
        tags: ['drink', 'party', 'alcohol', 'meeting', 'holidays', 'weekend']
      },
      { name: 'settings', tags: ['job', 'work', 'mechanic', 'nut'] },
      {
        name: 'receipt_long',
        tags: ['bills', 'restaurant', 'salary', 'finance']
      },
      {
        name: 'checkroom',
        tags: ['clothes', 'mall', 'dress', 'outfit', 'fashion']
      },
      { name: 'bed', tags: ['home', 'rest', 'furniture', 'sleep', 'nap'] },
      { name: 'card_giftcard', tags: ['holiday', 'events', 'present'] },
      { name: 'local_mall', tags: ['bag', 'wallet', 'shopping'] },
      {
        name: 'local_grocery_store',
        tags: ['money', 'list', 'shopping', 'cash', 'finance']
      },
      { name: 'email', tags: ['@', 'mail', 'e-mail'] },
      {
        name: 'report_problem',
        tags: ['exclamation_mark', 'warning', 'danger', 'necessary']
      },
      { name: 'flight', tags: ['trip', 'traveling', 'vacation', 'transport'] },
      { name: 'work', tags: ['business', 'job', 'office', 'case', 'money'] },
      {
        name: 'attractions',
        tags: ['rest', 'trip', 'activity', 'entertainment']
      },
      { name: 'local_florist', tags: ['flower', 'plant', 'grass', 'garden'] },
      { name: 'fitness_center', tags: ['hobby', 'sports', 'equipment'] },
      { name: 'phone', tags: ['call', 'talk', 'coversation', 'devices'] },
      {
        name: 'smartphone',
        tags: ['call', 'talk', 'coversation', 'devices', 'app']
      },
      {
        name: 'electrical_services',
        tags: ['electricity', 'power', 'devices', 'charge']
      },
      {
        name: 'directions_car',
        tags: ['transport', 'drive', 'road', 'travel', 'trip']
      },
      {
        name: 'pedal_bike',
        tags: ['transport', 'drive', 'road', 'travel', 'trip', 'bicycle']
      },
      {
        name: 'directions_bus',
        tags: ['transport', 'drive', 'road', 'travel', 'trip', 'autobus']
      },
      { name: 'clean_hands', tags: ['care', 'health'] },
      {
        name: 'face_retouching_natural',
        tags: ['beauty', 'care', 'makeup', 'cosmetics']
      },
      {
        name: 'school',
        tags: ['education', 'intelligence', 'knowledge', 'kids', 'teenager']
      },
      {
        name: 'theaters',
        tags: ['culture', 'films', 'cinema', 'movie', 'show']
      },
      {
        name: 'brush',
        tags: [
          'instrument',
          'hobby',
          'makeup',
          'cosmetics',
          'art',
          'creativity',
          'beauty'
        ]
      },
      {
        name: 'luggage',
        tags: ['trip', 'travel', 'holidays', 'journey', 'vacation', 'flight']
      },
      { name: 'gpp_good', tags: ['security', 'defence', 'safety'] },
      { name: 'title', tags: ['text', 'article', 'letter'] },
      {
        name: 'scale',
        tags: ['weight', 'health', 'nutrition', 'calories', 'fitness', 'sport']
      },
      { name: 'visibility', tags: ['eye', 'sight', 'look', 'public'] },
      { name: 'poll', tags: ['analitycs', 'chart', 'economics'] },
      {
        name: 'show_chart',
        tags: ['analitycs', 'chart', 'economics', 'finance', 'curve', 'stoks']
      },
      { name: 'smart_toy', tags: ['kids', 'robot', 'children'] },
      { name: 'info', tags: ['warning', 'exclamation_mark'] },
      { name: 'today', tags: ['calendar', 'event', 'holiday'] },
      { name: 'icecream', tags: ['sweet', 'food', 'kids', 'children'] },
      { name: 'image', tags: ['picture', 'photo'] },
      { name: 'photo_camera', tags: ['picture'] },
      { name: 'vpn_key', tags: ['lock', 'password', 'secure'] },
      { name: 'museum', tags: ['culture', 'art'] },
      { name: 'face', tags: ['head', 'beauty', 'care', 'makeup', 'cosmetics'] },
      {
        name: 'extension',
        tags: ['puzzle', 'board_games', 'hobby', 'entertainment']
      },
      { name: 'newspaper', tags: [] },
      { name: 'nightlight', tags: ['moon', 'dark'] },
      { name: 'light_mode', tags: ['sun', 'brightness'] },
      { name: 'cloud', tags: ['weather', 'sky'] },
      {
        name: 'landscape',
        tags: ['mountains', 'trip', 'travel', 'journey', 'vacation']
      },
      {
        name: 'cake',
        tags: ['birthsday', 'holiday', 'event', 'present', 'celebration']
      },
      { name: 'park', tags: ['tree', 'forest', 'nature'] },
      { name: 'event_note', tags: ['calendar'] },
      { name: 'send', tags: ['message', 'conversation', 'mail', 'chat'] },
      { name: 'local_police', tags: ['security', 'defence'] },
      { name: 'health_and_safety', tags: ['insurence'] },
      { name: 'format_paint', tags: ['build', 'instrument', 'repair'] },
      { name: 'desktop_windows', tags: ['pc', 'tv', 'monitor', 'devices'] },
      { name: 'notifications', tags: ['bell', 'message'] },
      { name: 'edit', tags: ['pen', 'notes', 'text'] },
      { name: 'sentiment_very_satisfied', tags: ['emotions', 'happy', 'joy'] },
      { name: 'translate', tags: ['language'] },
      { name: 'architecture', tags: ['scheme', 'drawing'] },
      { name: '3d_rotation', tags: ['hobby'] },
      { name: 'view_in_ar', tags: ['3d'] },
      { name: 'battery_charging_full', tags: ['power', 'electricity'] },
      { name: 'bluetooth', tags: ['communications', 'devices', 'connection '] },
      { name: 'wifi', tags: ['communication', 'internet', 'connection '] },
      { name: 'bathtub', tags: ['shower', 'care', 'clean'] },
      { name: 'door_front', tags: ['exit', 'entrance'] },
      { name: 'gavel', tags: ['laws', 'rules'] },
      { name: 'format_list_bulleted', tags: ['diary', 'notes', 'events'] },
      { name: 'delete', tags: ['remove', 'trash', 'bin'] },
      {
        name: 'science',
        tags: ['alchemy', 'chemisty', 'knowledge', 'education']
      },
      { name: 'search', tags: ['explore', 'find'] },
      { name: 'local_cafe', tags: ['food', 'drink', 'bar', 'coffee'] },
      { name: 'print', tags: ['documents'] },
      { name: 'percent', tags: ['mark', '%', 'economics', 'money', 'finance'] },
      { name: 'question_answer', tags: ['dialog', 'talk', 'message'] },
      { name: 'file_download', tags: [] },
      { name: 'file_upload', tags: [] },
      { name: 'play_arrow', tags: ['go', 'run', 'resume'] },
      { name: 'pause', tags: [] },
      { name: 'stop', tags: [] },
      { name: 'lightbulb', tags: ['idea', 'electricity', 'devices'] },
      { name: 'smoking_rooms', tags: ['cigarettes', 'habits', 'addiction'] },
      {
        name: 'push_pin',
        tags: ['bookmark', 'notes', 'map', 'location', 'place']
      },
      { name: 'android', tags: ['system', 'phone'] },
      { name: 'flag', tags: ['country', 'place', 'location', 'golf'] }
    ],
    categoryColors: [
      'red-2',
      'red-4',
      'red-6',
      'red-8',
      'red-10',
      'purple-2',
      'purple-4',
      'purple-6',
      'purple-8',
      'purple-10',
      'blue-2',
      'blue-4',
      'blue-6',
      'blue-8',
      'blue-10',
      'green-2',
      'green-4',
      'green-6',
      'green-8',
      'green-10',
      'yellow-2',
      'yellow-4',
      'yellow-6',
      'yellow-8',
      'yellow-10',
      'orange-2',
      'orange-4',
      'orange-6',
      'orange-8',
      'orange-10',
      'brown-2',
      'brown-4',
      'brown-6',
      'brown-8',
      'brown-10',
      'grey-1',
      'grey-4',
      'grey-6',
      'grey-8',
      'dark'
    ]
  }
}

const mutations = {}
const actions = {}

const getters = {
  categoryIcons: (state) => state.categoryIcons,
  categoryColors: (state) => state.categoryColors
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
