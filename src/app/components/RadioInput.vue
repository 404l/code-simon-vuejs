<template>
  <div class="radioButtonsWrap">
    <p v-if="isRequired"
      :class="{
        requiredAlert: true,
        requiredAlert_error: didSubmitAttempt &&
          !value
      }">
      Это поле обязательно для заполнения
    </p>
    <div class="buttonsWrap"
    >
      <label v-for="button in buttons"
        :disabled="disabled"
        tabindex="0"
        @keyup.enter="updateInputData(button.name)"
        :key="button.name"
        :for="button.name"
      >
        {{button.nameLocale}}
        <input class="button" type="radio"
          :disabled="disabled"
          tabindex="-1"
          :name="name" :value="button.name"
          :id="button.name"
          :checked="button.name === value"
          @change="updateInputData($event.target.value)"
        />
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadioInput',
  props: {
    flex_row: Boolean,
    flex_column: Boolean,
    disabled: Boolean,
    name: {
      type: String,
      required: true,
    },
    defaultValue: {
      type: String,
      default: '',
    },
    buttons: {
      type: Array,
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    didSubmitAttempt: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: this.defaultValue,
    };
  },
  methods: {
    updateInputData(value) {
      this.value = value;
      this.$emit('update-input-data', value);
    },
  },
};
</script>
