<template>
  <!-- 第一种：Frontmatter 自定义 footer -->
  <template v-if="footer">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="footerHtml" class="footer" v-html="footer" />
    <div v-else class="footer" v-text="footer" />
  </template>

  <!-- 第二种：主题预设 -->
  <template v-else>
    <div class="footer">
      <div class="footer-item">
        MIT Licensed | Copyright © {{footerInfo.CopyrightInfo.createdTime}} - <a :href="footerInfo.CopyrightInfo.href" target="_blank">{{footerInfo.CopyrightInfo.name}}</a>
      </div>
      <div class="footer-item">
        {{ getRandomEle(footerInfo.personalSignature) }}
      </div>
      <div class="footer-item">
         自 <span>{{ survivalTime.time }}</span> 建站以来，小站已苟活 <span>{{ survivalTime.day }}</span> 天 <span>{{ survivalTime.hour }}</span> 时 <span>{{ survivalTime.minutes }}</span> 分 <span>{{ survivalTime.second }}</span> 秒 <span class="emote">🤪</span>
      </div>
      <div class="footer-item">
        <a class="badge" v-for="item in footerInfo.badgeList" :key="item.id" target="_blank" :href="item.href" :title="item.title">
            <img class="badge" :src="item.imgSrc">
        </a>
      </div>
    </div>
  </template>
</template>


<script setup lang="ts">
import { computed, watch, reactive, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';
import { usePageData, usePageFrontmatter } from '@vuepress/client';
import { useThemeLocaleData } from '../composables/index.js';


const frontmatter = usePageFrontmatter(); // 返回当前页面 Frontmatter 的 Ref 对象
const footer = computed(() => frontmatter.value.footer);
const footerHtml = computed(() => frontmatter.value.footerHtml);


const footerInfo = computed(() => useThemeLocaleData().value.footer); // 返回当前 locale 下主题数据的 Ref 对象
const getRandomEle = (list: string[]) => list[Math.floor(Math.random()*list.length)];
const survivalTime = reactive({});
let timer = null;

onMounted(() => {
  timer = setInterval(()=>{
    Object.assign(survivalTime, {
      time: footerInfo.value.survivalTime,
      day: dayjs().diff(dayjs(`${footerInfo.value.survivalTime} 00:00:00  `), 'day'),
      hour: dayjs().hour(),
      minutes: dayjs().minute(),
      second: dayjs().second(),
    });
  },1000);
});

onUnmounted(() => {
  clearInterval(timer);
  timer = null;
});
</script>