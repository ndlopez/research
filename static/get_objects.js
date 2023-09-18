let apiKey = 'BxfX2Ho5Logh0lWk0AqY1MtZBE2SJVNGPLKfT4Ze'
const timeNow = new Date();
//const day = timeNow.getDate(); //date today
const monty = timeNow.getMonth() + 1; //starts from 0:Jan

const myDate = `2023-${monty.toString().padStart(2, '0')}-${timeNow.getDate()}`;
//console.log(day, monty,myDate);

const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${myDate}&end_date=${myDate}&api_key=${apiKey}`;

let vm = new Vue({
  el: '#app',
  data: {
    asteroids: [],
    showSummary: true,
  },
  computed: {
    numAsteroids() {
      return this.asteroids.length;
    },
    tag(){
        return myDate;
    },
    closestObject() {
      let neosHavingData = this.asteroids.filter(neo => neo.close_approach_data.length > 0)
      let simpleNeos = neosHavingData.map(neo => {
        return { name: neo.name, miles: neo.close_approach_data[0].miss_distance.miles }
      });
      let sortedNeos = simpleNeos.sort((a, b) => a.miles - b.miles)
      return sortedNeos[0].name
    }
  },
  methods: {
    fetchAstroids() {
      fetch(url)
      .then((res)=> res.json())
      .then((data) => {vm.asteroids = data.near_earth_objects[myDate]})
      .catch(error=>console.log("got:",error))
      /*useless axios func
      axios.get(url)
        .then((res) => {
          vm.asteroids = res.data.near_earth_objects[myDate]
        })*/
    },
    getCloseApproachDate(a) {
      if (a.close_approach_data.length > 0) {
        return a.close_approach_data[0].close_approach_date_full
      } else {
        return 'NA'
      }
    },
    remove(index) {
      this.asteroids.splice(index, 1)
    },
    isMissingData(asteroid) {
      return asteroid.close_approach_data.length == 0
    }
  },

  created() {
    this.fetchAstroids()
  },
});
