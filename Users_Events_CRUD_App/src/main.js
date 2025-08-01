"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./assets/main.css");
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
var index_1 = require("./router/index");
var app = (0, vue_1.createApp)(App_vue_1.default);
app.use(index_1.default);
app.mount('#app');
