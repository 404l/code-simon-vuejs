<template>
  <div class="simonGameWrap">
  <div class="simonCircleWrap"
    :class="{
      'beingHighlighted': isHighlighting,
      'gameNotOn': !isGameOn
    }"
  >
    <div v-for="sector in sectors" :key="sector.id"
      :class="{
        [sector.class]: true,
        'sector_highlighted': sector.isHighlighted
      }"
      @click="handleSectorClick(sector.id)"
      @keydown="handleSectorClick(sector.id)"
    >
    </div>
  </div>
  <div class="infoAndControls">
    <p v-if="!isUserFail"
      class="roundNumber">
      {{labelLocate.round}}: {{roundNumber}}
    </p>
    <div @click="startTheGame" @keydown="startTheGame">
      <ButtonO v-if="!isGameOn"
        type="button"
        filled
        :label="labelLocate.startTheGameButtonLabel"/>
    </div>
    <p v-if="isUserFail"
      class="lossAlert">
      {{labelLocate.youLostAlert}}
    </p>
    <div @click="repeatHighlight" @keydown="repeatHighlight">
      <ButtonO v-if="isGameOn"
        :disabled="isHighlighting"
        type="button"
        hollow
        :label="labelLocate.repeatHighlightButtonLabel"/>
    </div>
    <div class="setLevelButtons">
      <RadioInput
        flex_column
        :disabled="isHighlighting"
        :name="levelButtons.name"
        :buttons="levelButtons.buttons"
        :defaultValue="levelButtons.value"
        @update-input-data="setLevel"
      />
    </div>
    <div @click="tryLostRound" @keydown="tryLostRound">
      <ButtonO v-if="isUserFail"
        type="button"
        hollow
        :label="labelLocate.tryLostRoundButtonLabel"/>
    </div>
  </div>
  </div>
</template>

<script>
import audio0 from '../sounds/0.ogg';
import audio1 from '../sounds/1.ogg';
import audio2 from '../sounds/2.ogg';
import audio3 from '../sounds/3.ogg';

import ButtonO from './Button.vue';
import RadioInput from './RadioInput.vue';

export default {
  name: 'SimonGame',
  components: {
    ButtonO,
    RadioInput,
  },
  data() {
    return {
      sectorsInit: [
        {
          id: 0,
          class: 'sector sector_first',
          isHighlighted: false,
        },
        {
          id: 1,
          class: 'sector sector_second',
          isHighlighted: false,
        },
        {
          id: 2,
          class: 'sector sector_third',
          isHighlighted: false,
        },
        {
          id: 3,
          class: 'sector sector_fourth',
          isHighlighted: false,
        },
      ],
      roundNumber: 0,
      level: 'easy',
      isGameOn: false,
      isUserFail: false,
      isHighlighting: false,
      audiosArray: [
        audio0,
        audio1,
        audio2,
        audio3,
      ],
    };
  },
  computed: {
    labelLocate() {
      const { roundNumber } = this;
      return {
        round: 'Раунд',
        startTheGameButtonLabel: 'Начать новую игру',
        youLostAlert: `Вы проиграли в ${roundNumber} раунде`,
        tryLostRoundButtonLabel: 'Попробовать раунд ещё раз',
        repeatHighlightButtonLabel: 'Повторить последовательность',
        levels: {
          easy: 'легко',
          medium: 'средне',
          hard: 'сложно',
        },
      };
    },
    levelButtons() {
      return {
        name: 'level',
        value: 'easy',
        buttons: Object.entries(this.labelLocate.levels).map((level) => {
          const [name, nameLocale] = level;
          return ({
            name,
            nameLocale,
          });
        }),
      };
    },
    timeout() {
      switch (this.level) {
        case 'easy': return 1.5;
        case 'medium': return 1;
        case 'hard': return 0.4;
        default: return 1.5;
      }
    },
    sectors() {
      return this.sectorsInit.map((sector) => sector);
    },
    gameSelectedSectorsArray() {
      const data = [];
      for (let i = 0; i < this.roundNumber; i += 1) {
        data.push(this.getRandomNumber());
      }
      return data;
    },
    userSelectedSectorsArray() {
      return [];
    },
  },
  methods: {
    playAudio(index) {
      const audio = new Audio(this.audiosArray[index]);
      audio.play();
    },
    getRandomNumber() {
      return Math.floor(Math.random() * Math.floor(this.sectorsInit.length));
    },
    setLevel(value) {
      this.clearUserSelectedSectors();
      this.level = value;
      if (this.isGameOn && !this.isHighlighting) this.highlightSectors();
    },
    setIsGameOn(value) {
      this.isGameOn = value;
    },
    startTheGame() {
      this.clearUserSelectedSectors();
      this.setIsGameOn(true);
      this.roundNumber = 1;
      this.isUserFail = false;
      this.highlightSectors();
    },
    startNextRound() {
      this.clearUserSelectedSectors();
      this.roundNumber += 1;
      this.highlightSectors();
    },
    setIsHighlighting(value) {
      this.isHighlighting = value;
    },
    highlightSector(value) {
      this.sectors.forEach((sector) => {
        if (sector.id === value) {
          this.sectors[sector.id].isHighlighted = true;
          this.playAudio(sector.id);
          setTimeout(() => {
            this.sectors[sector.id].isHighlighted = false;
          }, (this.timeout / 2) * 1000);
        } else this.sectors[sector.id].isHighlighted = false;
      });
    },
    highlightSectors() {
      this.setIsHighlighting(true);
      const {
        timeout,
        gameSelectedSectorsArray,
        highlightSector,
      } = this;
      gameSelectedSectorsArray.forEach((number, index) => {
        setTimeout(() => {
          highlightSector(number);
        }, timeout * 1000 * (index + 1));
      });
      setTimeout(() => {
        this.setIsHighlighting(false);
      }, timeout * 1000 * (gameSelectedSectorsArray.length + 0.6));
    },
    repeatHighlight() {
      if (this.isHighlighting) return;
      this.clearUserSelectedSectors();
      this.highlightSectors();
    },
    setUserSelectedSectors(value) {
      this.userSelectedSectorsArray.push(value);
    },
    clearUserSelectedSectors() {
      this.userSelectedSectorsArray.length = 0;
    },
    setIsUserFail(userSelectedSectorId) {
      const {
        gameSelectedSectorsArray: gameSelectedArray,
        userSelectedSectorsArray: userSelectedArray,
      } = this;
      if (gameSelectedArray[userSelectedArray.length - 1] !== userSelectedSectorId) {
        this.handleUserFail();
      }
    },
    handleUserFail() {
      this.isUserFail = true;
      this.setIsGameOn(false);
    },
    tryLostRound() {
      this.isUserFail = false;
      this.setIsGameOn(true);
      this.clearUserSelectedSectors();
      this.highlightSectors();
    },
    handleSectorClick(sectorId) {
      const {
        gameSelectedSectorsArray: gameSelectedArray,
        userSelectedSectorsArray: userSelectedArray,
        isHighlighting, isGameOn,
        playAudio,
        setUserSelectedSectors,
        setIsUserFail,
        startNextRound,
      } = this;
      if (isHighlighting) return;
      playAudio(sectorId);
      if (!isGameOn) return;
      setUserSelectedSectors(sectorId);
      setIsUserFail(sectorId);
      if (!this.isUserFail
      && gameSelectedArray.length === userSelectedArray.length) {
        startNextRound();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.simonGameWrap {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
  .infoAndControls {
    display: flex;
    flex-direction: column;
    row-gap: 14px;
  }
  .simonCircleWrap {
    min-width: 300px;
    max-width: 300px;
    max-height: 300px;
    min-height: 300px;
    border: 4px solid white;
    box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.55);
    position: relative;
    cursor: pointer;
    .sector {
      transition: 0.25s;
      position: absolute;
      border-radius: inherit;
      width: 100%;
      height: 100%;
      opacity: 0.7;
      &_first {
        clip-path: polygon(50% 0%, 50% 50%, 0 50%, 0 0);
        background-color: red;
      }
      &_second {
        clip-path: polygon(100% 0%, 100% 50%, 50% 50%, 50% 0%);
        background-color: green;
      }
      &_third {
        clip-path: polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%);
        background-color: blue;
      }
      &_fourth {
        clip-path: polygon(0 50%, 0 100%, 50% 100%, 50% 50%);
        background-color: purple;
      }
      &_highlighted {
        opacity: 1!important;
      }
      &:hover {
        opacity: 1;
        @media (hover: none) {
          opacity: 0.5;
        }
      }
    }
  }
  .beingHighlighted {
    .sector {
      cursor: default;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
