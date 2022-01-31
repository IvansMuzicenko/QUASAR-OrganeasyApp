const state = () => {
  return {
    categoryIcons: [
      { name: '', tags: [] },
      {
        name: 'favorite_border',
        tags: ['heart', 'health', '<3', 'like', 'wish', 'medicine']
      },
      {
        name: 'medical_services',
        tags: ['health', 'care', 'heart', 'hospital', 'doctor']
      },
      { name: 'attach_money', tags: ['finance', 'dollar', 'usd', 'cash', '$'] },
      { name: 'euro', tags: ['money', 'finance', '€', 'cash'] },
      { name: 'currency_pound', tags: ['money', 'finance', 'cash', '£'] },
      { name: 'currency_ruble', tags: ['money', 'finance', 'cash', '₽'] },
      { name: 'request_quote', tags: ['bills', 'finance', 'money'] },
      { name: 'savings', tags: ['money', 'finance', 'cash', 'pig'] },
      {
        name: 'local_grocery_store',
        tags: ['money', 'list', 'shopping', 'cash', 'finance']
      },
      {
        name: 'handyman',
        tags: ['work', 'hobby', 'tools', 'instrument', 'job']
      },
      { name: 'business', tags: ['building', 'office', 'work', 'job'] },
      {
        name: 'engineering',
        tags: ['profession', 'job', 'work', 'specialization', 'occupation']
      },
      { name: 'work', tags: ['business', 'job', 'office', 'case', 'money'] },
      { name: 'restaurant', tags: ['food', 'cafe', 'dishes', 'tableware'] },
      { name: 'kitchen', tags: ['food', 'refrigerator', 'fridge', 'devices'] },
      { name: 'icecream', tags: ['sweet', 'food', 'kids', 'children'] },
      { name: 'local_cafe', tags: ['food', 'drink', 'bar', 'coffee'] },
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
      {
        name: 'liquor',
        tags: ['drink', 'party', 'alcohol', 'meeting', 'holidays', 'weekend']
      },
      { name: 'people', tags: ['friends', 'man', 'woman', 'family'] },
      { name: 'groups', tags: ['people', 'family'] },
      { name: 'child_friendly', tags: ['kids', 'baby', 'family'] },
      { name: 'pets', tags: ['animals', 'cat', 'dog', 'paw', 'toys'] },
      { name: 'auto_stories', tags: ['book', 'notes', 'recordings', 'diary'] },
      {
        name: 'school',
        tags: ['education', 'intelligence', 'knowledge', 'kids', 'teenager']
      },
      {
        name: 'psychology',
        tags: ['brain', 'science', 'intelligence', 'head']
      },
      {
        name: 'bolt',
        tags: ['electricity', 'power', 'lightning', 'bills', 'devices']
      },
      { name: 'computer', tags: ['electricity', 'pc', 'laptop', 'devices'] },
      { name: 'phone', tags: ['call', 'talk', 'coversation', 'devices'] },
      {
        name: 'smartphone',
        tags: ['call', 'talk', 'coversation', 'devices', 'app']
      },
      { name: 'desktop_windows', tags: ['pc', 'tv', 'monitor', 'devices'] },
      {
        name: 'electrical_services',
        tags: ['electricity', 'power', 'devices', 'charge']
      },
      { name: 'lightbulb', tags: ['idea', 'electricity', 'devices'] },
      { name: 'face', tags: ['head', 'beauty', 'care', 'makeup', 'cosmetics'] },
      {
        name: 'face_retouching_natural',
        tags: ['beauty', 'care', 'makeup', 'cosmetics']
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
      { name: 'shower', tags: ['bathroom', 'water', 'clean', 'care', 'bills'] },
      { name: 'clean_hands', tags: ['care', 'health'] },
      { name: 'bathtub', tags: ['shower', 'care', 'clean'] },
      { name: 'headphones', tags: ['music', 'songs', 'sounds'] },
      {
        name: 'music_note',
        tags: ['songs', 'sounds', 'playlist', 'artist', 'hobby', 'creativity']
      },
      {
        name: 'theaters',
        tags: ['culture', 'films', 'cinema', 'movie', 'show']
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
      { name: 'flight', tags: ['trip', 'traveling', 'vacation', 'transport'] },
      {
        name: 'luggage',
        tags: ['trip', 'travel', 'holidays', 'journey', 'vacation', 'flight']
      },
      {
        name: 'landscape',
        tags: ['mountains', 'trip', 'travel', 'journey', 'vacation']
      },
      {
        name: 'public',
        tags: ['earth', 'world', 'trip', 'vacation', 'journey']
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
      { name: 'location_on', tags: ['map', 'gps', 'place', 'point'] },
      { name: 'flag', tags: ['country', 'place', 'location', 'golf'] },
      { name: 'home', tags: ['building', 'house', 'family', 'apartment'] },
      { name: 'fitness_center', tags: ['hobby', 'sports', 'equipment'] },
      {
        name: 'palette',
        tags: ['hobby', 'art', 'interests', 'free-time', 'creativity']
      },
      {
        name: 'extension',
        tags: ['puzzle', 'board_games', 'hobby', 'entertainment']
      },
      {
        name: 'checkroom',
        tags: ['clothes', 'mall', 'dress', 'outfit', 'fashion']
      },
      { name: 'local_mall', tags: ['bag', 'wallet', 'shopping'] },
      { name: 'architecture', tags: ['scheme', 'drawing'] },
      { name: '3d_rotation', tags: ['hobby'] },
      { name: 'view_in_ar', tags: ['3d'] },
      { name: 'bed', tags: ['home', 'rest', 'furniture', 'sleep', 'nap'] },
      {
        name: 'attractions',
        tags: ['rest', 'trip', 'activity', 'entertainment']
      },
      { name: 'card_giftcard', tags: ['holiday', 'events', 'present'] },
      {
        name: 'cake',
        tags: ['birthsday', 'holiday', 'event', 'present', 'celebration']
      },
      {
        name: 'emoji_events',
        tags: ['award', 'competition', 'prize', 'goal', 'reward']
      },
      { name: 'email', tags: ['@', 'mail', 'e-mail'] },
      { name: 'language', tags: ['world', 'planet', 'internet'] },
      { name: 'local_florist', tags: ['flower', 'plant', 'grass', 'garden'] },
      { name: 'male', tags: ['human', 'person'] },
      { name: 'female', tags: ['human', 'person'] },
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
      { name: 'image', tags: ['picture', 'photo'] },
      { name: 'photo_camera', tags: ['picture'] },
      { name: 'museum', tags: ['culture', 'art'] },
      { name: 'lock', tags: ['secret', 'code', 'password'] },
      { name: 'vpn_key', tags: ['lock', 'password', 'secure'] },
      { name: 'smart_toy', tags: ['kids', 'robot', 'children'] },
      { name: 'settings', tags: ['job', 'work', 'mechanic', 'nut'] },
      { name: 'watch_later', tags: ['clock', 'time', 'plans', 'alarm'] },
      { name: 'nightlight', tags: ['moon', 'dark'] },
      { name: 'light_mode', tags: ['sun', 'brightness'] },
      { name: 'cloud', tags: ['weather', 'sky'] },
      { name: 'thermostat', tags: ['hot', 'cold', 'temperature', 'weather'] },
      { name: 'park', tags: ['tree', 'forest', 'nature'] },
      { name: 'send', tags: ['message', 'conversation', 'mail', 'chat'] },
      { name: 'gpp_good', tags: ['security', 'defence', 'safety'] },
      { name: 'local_police', tags: ['security', 'defence'] },
      { name: 'health_and_safety', tags: ['insurence'] },
      { name: 'format_paint', tags: ['build', 'instrument', 'repair'] },
      { name: 'edit', tags: ['pen', 'notes', 'text'] },
      { name: 'sentiment_very_satisfied', tags: ['emotions', 'happy', 'joy'] },
      { name: 'battery_charging_full', tags: ['power', 'electricity'] },
      { name: 'door_front', tags: ['exit', 'entrance'] },
      { name: 'gavel', tags: ['laws', 'rules'] },
      { name: 'delete', tags: ['remove', 'trash', 'bin'] },
      {
        name: 'science',
        tags: ['alchemy', 'chemisty', 'knowledge', 'education']
      },
      { name: 'smoking_rooms', tags: ['cigarettes', 'habits', 'addiction'] },
      {
        name: 'push_pin',
        tags: ['bookmark', 'notes', 'map', 'location', 'place']
      },
      {
        name: 'report_problem',
        tags: ['exclamation_mark', 'warning', 'danger', 'necessary']
      },
      { name: 'info', tags: ['warning', 'exclamation_mark'] },
      { name: 'question_answer', tags: ['dialog', 'talk', 'message'] },
      { name: 'today', tags: ['calendar', 'event', 'holiday'] },
      { name: 'event_note', tags: ['calendar'] },
      {
        name: 'receipt_long',
        tags: ['bills', 'restaurant', 'salary', 'finance']
      },
      { name: 'description', tags: ['note', 'bookmark', 'list', 'sheet'] },
      { name: 'format_list_bulleted', tags: ['diary', 'notes', 'events'] },
      { name: 'search', tags: ['explore', 'find'] },
      { name: 'print', tags: ['documents'] },
      { name: 'notifications', tags: ['bell', 'message'] },
      { name: 'bluetooth', tags: ['communications', 'devices', 'connection '] },
      { name: 'wifi', tags: ['communication', 'internet', 'connection '] },
      { name: 'android', tags: ['system', 'phone'] },
      { name: 'file_download', tags: [] },
      { name: 'file_upload', tags: [] },
      { name: 'play_arrow', tags: ['go', 'run', 'resume'] },
      { name: 'pause', tags: [] },
      { name: 'stop', tags: [] },
      { name: 'alternate_email', tags: ['@', 'mail', 'e-mail', 'email'] },
      {
        name: 'star_border',
        tags: ['star', 'favorites', 'hotel', 'sky', 'night']
      },
      { name: 'translate', tags: ['language'] },
      { name: 'title', tags: ['text', 'article', 'letter'] },
      { name: 'percent', tags: ['mark', '%', 'economics', 'money', 'finance'] },
      { name: 'add', tags: ['plus', '+', 'create'] },
      { name: 'remove', tags: ['delete', 'minus', '-'] },
      { name: 'tag', tags: ['hashtag', 'cell'] },
      { name: 'format_quote', tags: ['book', 'dialog', 'replica', 'text'] },
      { name: 'help_outline', tags: ['question_mark'] },
      {
        name: 'priority_high',
        tags: ['exclamation_mark', 'warning', 'danger', 'necessary']
      }
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
