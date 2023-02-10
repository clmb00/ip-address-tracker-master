<script>

import "../node_modules/leaflet/dist/leaflet.css";
import L from "leaflet";

import { DateTime } from 'luxon';

export default{
  name: 'App',
  data(){
    return{
      map: null,
      marker: null,
      userIp: null,
      alreadyCreated: false,
      center: [37, -122],
      ipToSearch: '',
      searchedIp: '',
      city: '',
      state: '',
      zip: '',
      timezone: '',
      isp: '',
      apiUrl: 'http://ip-api.com/json/'
    }
  },
  methods:{
    createMap(){
      this.map = L.map('map').setView(this.center, 16);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      var myIcon = L.icon({
        iconUrl: '/icon-location.svg',
        iconSize: [30, 43]
      });

      this.marker = L.marker(this.center, {icon: myIcon});
      this.marker.addTo(this.map);
    },
    findLocations(ip){
      fetch(this.apiUrl + ip)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          this.center[0] = response.lat;
          this.center[1] = response.lon;
          this.searchedIp = response.query;
          this.city = response.city;
          this.state = response.countryCode;
          this.zip = response.zip;
          this.timezone = this.formatTimezoneToUTC(response.timezone);
          this.isp = response.isp;
          if(!this.alreadyCreated){
            this.createMap();
            this.alreadyCreated = true;
          } else {
            this.map.flyTo(this.center, 16);
            this.marker.setLatLng(this.center);
          }
        });
    },
    getUserIp(){
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(response => {
          this.userIp = response.ip;
          this.findLocations(this.userIp)
        });
    },
    searchIp(){
      if(this.ipToSearch != ''){
        this.findLocations(this.ipToSearch)
      }
    },
    formatTimezoneToUTC(timezoneCode){
      let tempTimezone = DateTime.local().setZone(timezoneCode).offset / 60;
      let decimal = '';

      (!Number.isInteger(tempTimezone)) ? decimal = ':30' : decimal = ':00'
      tempTimezone = Math.floor(tempTimezone);

      if(tempTimezone >= 0){
        tempTimezone >= 10 ? tempTimezone = '+' + tempTimezone + decimal : tempTimezone = '+0' + tempTimezone + decimal
      } else {
        tempTimezone <= -10 ? tempTimezone = tempTimezone + decimal : tempTimezone = '-0' + tempTimezone*-1 + decimal
      };

      return tempTimezone;
    }
  },
  mounted(){
    this.getUserIp();
  }
}

</script>

<template>
  
  <div class="outer_box text-center font-rubik text-lg relative w-full">

    <h1 class="text-white font-bold text-3xl mb-9 pt-9">IP Address Tracker</h1>

    <div class="input_box h-[60px] mb-[50px] mx-2">
      <input type="text" class="rounded-l-[1rem] w-[500px] px-6 h-full outline-none " name="ipSearch" id="ipSearch" placeholder="Search for any IP address or domain" v-model="ipToSearch">
      <button class="my_btn bg-myVerydarkgrey h-full px-6 rounded-r-[1rem] hover:bg-myDarkgrey" @click="searchIp()">
        <img src="./assets/images/icon-arrow.svg" alt=">">
      </button>
    </div>
    
    <div class="info_box bg-white grid grid-cols-4 p-8 max-w-screen-lg rounded-[1rem] text-left shadow-lg">
      <div class="card pl-4 pr-2">
        <p class="text-myDarkgrey uppercase font-semibold text-sm tracking-widest">IP Address</p>
        <p class="font-bold text-3xl mt-3">{{searchedIp}}</p>
      </div>
      <div class="card pl-4 pr-2">
        <p class="text-myDarkgrey uppercase font-semibold text-sm tracking-widest">Location</p>
        <p class="font-bold text-3xl mt-3">{{city}}, {{state}} {{zip}}</p>
      </div>
      <div class="card pl-4 pr-2">
        <p class="text-myDarkgrey uppercase font-semibold text-sm tracking-widest">Timezone</p>
        <p class="font-bold text-3xl mt-3">UTC {{ timezone }}</p>
      </div>
      <div class="card pl-4">
        <p class="text-myDarkgrey uppercase font-semibold text-sm tracking-widest">ISP</p>
        <p class="font-bold text-3xl mt-3">{{isp}}</p>
      </div>
    </div>

    <div id="map" class="w-full">

    </div>

  </div>

</template>

<style>

.outer_box{
  background-image: url('./assets/images/pattern-bg.png');
  background-size: cover;
  height: 280px;
}

.my_btn{
  /* weird*/
  transform: translateY(1.2px);
}

.info_box{
  margin: 0 auto;
}

#map{
  position: absolute;
  height: calc(100vh - 280px);
  top: 280px;
  left: 0;
  z-index: -1;
}

.card{
  position: relative;
  /* padding-right: 1rem; */
}

.card:not(:last-child)::after{
  content: '';
  position: absolute;
  top: 10px;
  bottom: 10px;
  right: 0px;
  display: block;
  background-color: hsl(0, 0%, 59%);
  width: 1px;
}

</style>
