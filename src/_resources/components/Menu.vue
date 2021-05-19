<template>
  <div class="sidebar" :class="{ 'menu-open' : menuOpen, 'audio-active': audio_active }" @mouseleave="currentlyHovered = null">

    <div class="sidebar--header">
      <div>
        <h1 class="sidebar--title">Hiding in Plain Sight</h1>
        <h2 v-if="is_tour" class="sidebar--subtitle">
          Walking tour
        </h2>
        <h2 v-else class="sidebar--subtitle">
          <ICountUp
            :delay="500"
            :endVal="cinemas.length"
            :options="{useEasing: false, duration: 3}"/>
          cinemas
        </h2>
      </div>
      <button class="button" v-if="!isLandscape" @click="menuOpen = !menuOpen" v-html="menuOpen ? 'Show map' : 'Show list'"></button>
    </div>

    <input v-if="!is_tour" class="search-input" type="text" v-model="search" placeholder="Search by name.."/>

    <nav class="sidebar-menu">
      <!-- <router-link v-for="(cinema, key) in filteredList" class="sidebar-menu--item" :class="cinema.slug == clicked ? 'active' : ''" :to="is_tour ? { name: 'tourcinema', params: { slug: cinema.slug } } : { name: 'cinema', params: { slug: cinema.slug } }" :ref="cinema.slug" @mouseenter.native="mouseoverStart($event, cinema.slug)" :key="cinema.slug"> -->
      <div v-for="(cinema, key) in filteredList" class="sidebar-menu--item"  @click="$emit('menu-hovered',cinema.slug)" :ref="cinema.slug" :key="cinema.slug">
        <div class="image">
          <img v-if="cinema.image_small" :src="cinema.image_small" />
          <span v-else>?</span>
        </div>
        <div>
          <div class="sidebar-menu--tour-number" v-if="is_tour">Stop {{ key + 1 }}</div>
          <h3 class="sidebar-menu--title" v-html="cinema.title"></h3>
          <div class="sidebar-menu--subtitle">
            <span class="sidebar-menu--status">{{cinema.status}}</span>
            <span class="sidebar-menu--photos" v-if="cinema.photo_count">{{cinema.photo_count}}</span>
            <span class="sidebar-menu--comments" v-if="commentCounts && commentCounts[`/cinemas/${cinema.slug}`]">{{ commentCounts[`/cinemas/${cinema.slug}`]}}</span>
          </div>
        </div>
      </div>
      <!-- </router-link> -->
    </nav>
  </div>
</template>

<script>
import ICountUp from 'vue-countup-v2';

export default {
  name: 'Menu',
  props: ['is_tour','cinemas','clicked', 'audio_active', 'isLandscape'],
  components: {ICountUp},
  data() {
    return {
      search: null,
      menuOpen: false,
      currentlyHovered: null,
      commentCounts: null
    }
  },
  computed: {
    filteredList() {
      if(!this.search) {
        return this.cinemas;
      }
      else {
        return this.cinemas.filter(cinema => {
          return cinema.title.toLowerCase().includes(this.search.toLowerCase());
        })
      }
    }
  },
  watch: {
    clicked: function (clicked) {
      if(clicked) {
        console.log(clicked);
        this.menuOpen = false;
        let clickedMenuElement = this.$refs[clicked][0].$el;
        if(clickedMenuElement) {
          if (this.isLandscape && !this.currentlyHovered) {
            clickedMenuElement.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
          }
        }
      }
    },
    cinemas: function (cinemas) {
      if(cinemas.length) {

        let postData = {
          "domain": "https://lostcinemas.co.uk",
          "paths" : this.cinemas.map(cinema => `/cinemas/${cinema.slug}`)
        };

        axios
          .post('https://commento.jdp.org.uk/api/comment/count', JSON.stringify(postData))
          .then(response => {
            this.commentCounts = response.data.commentCounts
          })
          .catch(error => {
            this.errored = true
          })
      }
    }
  },
  methods: {
    // clickMenuElement(event, slug) {
    //   this.$router.push({ name: 'cinema', params: { slug: slug } })
    // },
    // mouseoverStart(event, slug) {
    //   if(!this.menuOpen) {
    //     this.currentlyHovered = slug;
    //     setTimeout(() => {
    //       if(this.currentlyHovered === slug && (this.$router.currentRoute.name == 'cinemas' || this.$router.currentRoute.name == 'tour')) {
    //         this.$emit('menu-hovered',slug);
    //       }
    //     },750);
    //   }
    // },
    // mouseoverCancel() {
    //   this.currentlyHovered = null;
    // }
  },
  mounted() {
  }
}
</script>

<style lang="scss">

@import '../styles/base.scss';

.sidebar {
  z-index: 999999;
  position: absolute;
  background-color: white;
  padding: ms(2) 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-top: 1px solid $medium-gray;
  transition: top 0.5s ease-in-out, z-index 1.5s ease;
  top: calc(100% - #{2 * ms(3) + ms(4)});

  &.audio-active {
    top: calc(100% - #{2 * ms(3) + ms(4)}  - 3rem);

  }

  &.menu-open {
    overflow-y: auto;
    z-index: 9999999;
    top: 0;
    transition: top 0.5s ease-in-out, z-index 0s ease;
  }

  @media screen and (orientation: landscape) and (min-width: 800px) {
    overflow-y: auto;
    position: static;
    padding: ms(6) 0;
    border-top: none;
    border-right: 2px solid $medium-gray;
    width: $sidebar-width;
    height: 100%;
  }
}

.search-input {
  border-radius: 99999px;
  margin: 0 ms(0) ms(-2);
  border: 1px solid $medium-gray;
  width: calc(100% - #{2 * ms(2)});
  padding: ms(-4) ms(0);
  padding-left: 2em;

  @media screen and (orientation: landscape) and (min-width: 800px) {
    margin: 0 ms(-1) ms(-2);
    width: calc(100% - #{2 * ms(-1)});
  }

  &:focus {
    outline: none;
    border-color: $gray;
  }

  background-image: url(/assets/images/search-icon.svg);
  background-size: ms(0);
  background-repeat: no-repeat;
  background-position: 0.75em center;

}

.sidebar--header {
  line-height: ms(4);
  padding: 0 ms(0) ms(2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (orientation: landscape) and (min-width: 800px) {
    padding: 0 ms(2) ms(2);
  }
}

.sidebar--title {
  font-weight: 900;
  font-size: ms(2);
  line-height: 1;
  font-style: italic;
  font-family: mikado;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: 0.02rem;
  margin-bottom: ms(-6);

  @media screen and (orientation: landscape) and (min-width: 800px) {
    display: none;
  }
}

.sidebar--subtitle {
  font-weight: 700;
  font-size: ms(0);
  color: $gray;

  @media screen and (orientation: landscape) and (min-width: 800px) {
    font-size: ms(2);
    color: $black;
  }
}

.sidebar-menu--item {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: background-color $base-timing $base-duration, border $base-timing $base-duration;
  padding: ms(-2) ms(-1) ms(-2) ms(0) * 0.75;
  border-left: ms(2)/4 solid transparent;
  border-bottom: 1px solid $light-gray;

  @media screen and (orientation: landscape) and (min-width: 800px) {
    padding: ms(-2) ms(-1) ms(-2) ms(2) * 0.75;
  }

  &:hover {
    background-color: $light-blue;
  }

  &.active,
  &.router-link-exact-active {
    border-left-color: $orange;
  }

  .image {
    flex: 0 0 75px;
    display: block;
    width: 75px;
    height: 75px;
    background-color: $cream;
    margin-right: ms(-1);
    padding: 4px 4px 0;
    position: relative;

    img {
      margin-left: auto;
      margin-right: auto;
      object-fit: contain;
      object-position: center bottom;
      display: block;
      height: 100%;
      image-rendering: -webkit-optimize-contrast;
    }

    span {
      font-size: ms(3);
      color: $red;
      font-weight: 700;
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
  &:nth-child(4n - 3) .image {
    background-color: transparentize($red,0.9);
  }
  &:nth-child(4n - 2) .image {
    background-color: transparentize($orange,0.25);
  }
  &:nth-child(4n - 1) .image {
    background-color: transparentize($blue,0.6);
  }
  &:nth-child(4n) .image {
    background-color: $cream;
  }
}

.sidebar-menu--tour-number {
  display: inline-block;
  margin-bottom: ms(-6);
  font-size: ms(-1);
  padding: 0 0.5em;
  border-radius: 3em;
  background-color: $orange;
}

.sidebar-menu--title {
  font-weight: 400 !important;
}

.sidebar-menu--subtitle {
  display: flex;
  flex-direction: row;
  color: $gray;
  font-size: ms(-1);
  margin-top: ms(-6);
  margin-bottom: 0;

  span {
    display: inline-block;

    &::before {
      vertical-align: text-top  ;
      display: inline-block;
      height: 1.1em;
      width: 1.2em;
      content: '';
      margin-right: 0.3em;
      background-size: contain;
      background-position: center right;
      background-repeat: no-repeat;
      opacity: 0.2;
    }

    + span {
      margin-left: ms(-4);
    }
  }
}

.sidebar-menu--status::before {
  background-image: url(/assets/images/eye-icon.svg);
}

.sidebar-menu--comments::before {
  background-image: url(/assets/images/comment-icon.svg);
}

.sidebar-menu--photos::before {
  background-image: url(/assets/images/camera-icon.svg);

}

</style>